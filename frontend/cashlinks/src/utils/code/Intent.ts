import * as ed25519 from '@noble/ed25519';
import * as proto from "../../api";
import { Action, TemporaryPrivacyExchangeAction, TemporaryPrivacyTransferAction } from "./Action";
import { Environment } from "./Environment";
import { Keypair, PublicKey } from "@solana/web3.js";
import { RpcStream } from '../../service';
import { getOwnerKeypair } from "./TimelockAccount";

export class Intent {
    id : any;
    env: Environment;
    metadata: proto.Metadata;
    actions: Action[];

    constructor(actions: Action[], metadata: proto.Metadata, env: Environment, id?: Uint8Array) {
        this.actions = actions;
        this.metadata = metadata;
        this.env = env;

        if (id) {
            this.id = Buffer.from(id);
        } else {
            // Generate a random ID for this intent
            this.id = (new Keypair).publicKey.toBuffer();
        }

        // Set ids for all actions
        let actionId = 0;
        for (const action of actions) {
            action.setId(actionId++);

            // Some actions need to know what intent they are part of
            if (action instanceof TemporaryPrivacyExchangeAction || 
                action instanceof TemporaryPrivacyTransferAction) {
                action.intentId = this.id;
            }
        }
    }

    async toProto(): Promise<proto.SubmitIntentRequest> {
        const owner = getOwnerKeypair(this.env.keyphrase);
        const metadata = this.metadata;
        const actions : proto.Action[] = [];

        for (const action of this.actions) {
            const proto = await action.toProto()
            actions.push(proto);
        }

        const submitActions = new proto.SubmitIntentRequest_SubmitActions({
            id: { value: this.id },
            owner: { value: owner.publicKey.toBuffer() },
            metadata,
            actions,
        });

        // Sign the payload using the owner's keypair
        const buf = submitActions.toBinary();
        const sig = await ed25519.sign(buf, owner.secretKey.subarray(0, 32));

        // Verify the signature
        if (!await ed25519.verify(sig, buf, owner.publicKey.toBuffer())){
            throw new Error("Signature verification failed");
        }

        submitActions.signature = new proto.Common.Signature({ value: Buffer.from(sig) });

        return new proto.SubmitIntentRequest({
            request: { case: "submitActions", value: submitActions, }
        });
    }

    async submit(url: string) : Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const req = await this.toProto();
            const stream = await RpcStream.create(proto.Transaction, "submitIntent", url);

            try {
                console.log("Sending request", req);
                stream.write(req);
            } catch (error) {
                console.log(error);
            }

            (async () => {
                for await (const [res, err] of stream.read()) {
                    if (err) {
                        console.error(err);
                        break;
                    }
                    console.log(res);
                    if (res) {
                        if (!res) {
                            throw new Error("Unexpected response from server");
                        }

                        if (res.response.case == "error") {
                            console.error(res.response.value);
                            reject(res.response.value);
                            break;
                        }

                        if (res.response.case == "success") {
                            console.log("Intent submitted successfully");
                            resolve();
                            break;
                        }

                        if (res.response.case == "serverParameters") {
                            const req = await this.sign(res);
                            stream.write(req);
                        }
                    }
                }
                console.log("Closing stream");
                stream.close();
            })();
        });
    }

    async sign(data: proto.SubmitIntentResponse) : Promise<proto.SubmitIntentRequest> {
        // Check that the server is requesting signatures
        if (data.response.case != "serverParameters") {
            throw new Error("Unexpected response from server");
        }

        // Check that we have received the same amount of params as actions that
        // that were submitted.
        const params : proto.ServerParameter[] = (data.response.value as proto.SubmitIntentResponse_ServerParameters).serverParameters;
        if (params.length != this.actions.length) {
            new Error("Unexpected number of server parameters");
        }

        const sigs : proto.Common.Signature[] = [];

        // Iterate through all the actions and identify those that
        // require at least one client signature. Clients use a
        // well-known construction heuristic using client and server
        // parameters to make the transaction for signing.
        for (let i = 0; i < params.length; i++) {
            const param : proto.ServerParameter = params[i];
            const action : Action = this.actions[i];

            // Update the action with server parameters (if any)
            await action.updateFromServerResponse(param);

            // Append the signatures to our response
            const signatures = await action.getSignatures(this.env);

            // Add remaining signatures to the response
            for (const value of signatures) {
                sigs.push(new proto.Common.Signature({ value }));
            }
        }

        return new proto.SubmitIntentRequest({
            request: {
                case: "submitSignatures",
                value: new proto.SubmitIntentRequest_SubmitSignatures({
                    signatures: sigs,
                })
            }
        });
    }
}
