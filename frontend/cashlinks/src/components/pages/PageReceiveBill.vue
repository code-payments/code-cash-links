<script lang="ts" setup>
import Bugsnag from '@bugsnag/js';
import QRCode from 'qrcode';
import base58 from 'bs58';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { PublicKey, Keypair } from '@solana/web3.js';

import { Code, Kik, Kin, Secret, UserAgent } from '../../utils';
import { getAccountInfoRequestProto, NoPrivacyWithdrawAction, TimelockAccount } from '../../utils/code';
import { RpcStream } from '../../service';
import { useConfig } from '../../config';
import * as proto from '../../api';
import { info } from '../../console';

import { CodeWalletBill } from '../elements';
import { SectionHeader, SectionFooter } from '../sections';

interface AppConfig {
    keyphrase: string;
    mint: PublicKey;
    subsidizer: PublicKey;
}

const router = useRouter();
const props = defineProps({
    entropy: {
        type: String,
        required: true,
    },
});

watch(() => props.entropy, () => { router.go(0); });

const balance = ref(0);
const isLoading = ref(true);
const isScanned = ref(false);
const kikcode = ref<Uint8Array | undefined>();
const qrDownloadLink = ref<string | undefined>();
const qrShow = ref(false);
const safariSwap = ref(false);

// Setup the bill from the entropy
const init = async (account: TimelockAccount) => {
    const config = useConfig();
    const getAccountInfo = await RpcStream.createUnaryMethod(proto.Account, "getTokenAccountInfos", config.wsPath());
    const req = await getAccountInfoRequestProto(account.authority)
    const res = await getAccountInfo(req);

    account.updateFromServer(res);

    // Special case for mobile devices
    const isClaimed = Number(account.getCachedBalance()) == 0;
    if (isClaimed && UserAgent.isMobileDevice()) {
        try {
            const exchangeInfo = res.tokenAccountInfos[account.getVault().toBase58()].originalExchangeData;
            account.cachedBalance = BigInt(Kin.FromQuarks(Number(exchangeInfo?.quarks))) ?? BigInt(70121);
        } catch (e) {
            console.error(e, "Unable to determine original balance");
            account.cachedBalance = BigInt(70121);
        }
    }
}

// Connect to the server to listen to scan events
const rendezvous = async (rendezvousKey: Uint8Array): Promise<proto.Message | undefined> => {
    let success = false;
    return new Promise(async (resolve, reject) => {
        const config = useConfig();
        const stream = await RpcStream.create(proto.Messaging, "openMessageStream", config.wsPath(), {
            onClose: () => {
                if (!success) {
                    reject("Stream closed");
                }
            },
            onError: (err: any) => {
                console.error(err);
                if (!success) {
                    reject(err);
                }
            },
        });

        stream.write(new proto.OpenMessageStreamRequest({
            rendezvousKey: new proto.RendezvousKey({
                value: rendezvousKey,
            }),
        }));

        for await (const [res, err] of stream.read()) {
            if (err) {
                console.error(err);
                reject(err);
                break;
            }
            if (res) {
                if (res instanceof proto.OpenMessageStreamResponse) {
                    for (const msg of res.messages) {
                        if (msg.kind.case === "requestToGrabBill") {
                            success = true;
                            stream.close();
                            resolve(msg);
                            return;
                        }
                    }
                }
            }
        }
        success = true;
        stream.close();
        resolve(undefined);
    });
}

const getDownloadImage = async (id: string) => {
    const config = useConfig();
    const url = config.httpPath() + "/download/" + encodeURIComponent(id);
    return await QRCode.toDataURL(url);
}

const isDownloadDone = async (id: string) => {
    const config = useConfig();
    const url = config.httpPath() + "/download/" + encodeURIComponent(id) + "/status";
    const res = await fetch(url);
    const data = await res.json();
    const done = (data.status === "completed" || data.status === "expired")
    return done;
}

const showDownloadImage = async () => {
    if (qrShow.value) {
        qrShow.value = false;
        return;
    }

    const randId = Keypair.generate().publicKey.toBase58().substring(0, 7)
    qrDownloadLink.value = await getDownloadImage(randId);

    const intervalId = setInterval(async () => {
        if (!qrShow.value || await isDownloadDone(randId)) {
            clearInterval(intervalId);
            qrShow.value = false;
        };
    }, 400);

    qrShow.value = true;
}

const attemptRemoteSend = async (
    rendezvousKey: Uint8Array,
    account: TimelockAccount,
    amount: number,
    env: AppConfig,
) => {

    const config = useConfig();

    let msg: proto.Message | undefined;
    try {
        msg = await rendezvous(rendezvousKey);
    } catch (e: any) {
        console.error(e);
        Bugsnag.notify(e);
        return false;
    }

    if (!msg) {
        console.error("No message received");
        Bugsnag.notify("No message received");
        return false;
    }

    if (msg.kind.case !== "requestToGrabBill") {
        console.error("No request for payment");
        Bugsnag.notify("No request for payment");
        return false;
    }

    const req = msg?.kind.value;
    if (!req) {
        console.error("No request for payment");
        Bugsnag.notify("No request for payment");
        return false;
    }

    if (!req.requestorAccount || !req.requestorAccount.value) {
        console.error("Invalid requestor account");
        Bugsnag.notify("Invalid requestor account");
        return false;
    }

    // Begin the scan animation optimistically
    isScanned.value = true;

    const destination = new PublicKey(req?.requestorAccount?.value);
    const actions = [
        new NoPrivacyWithdrawAction(account, destination, amount)
    ];
    const metadata = new proto.Metadata({
        type: {
            case: "receivePaymentsPublicly",
            value: {
                source: { value: account.getVault().toBuffer() },
                quarks: BigInt(amount),
                isRemoteSend: true,
            }
        }
    })

    try {
        const intent = new Code.Intent(actions, metadata, env, rendezvousKey);
        await intent.submit(config.wsPath());
    } catch (e) {
        console.error(e);

        if (JSON.stringify(e).includes("claimed")) {
            router.push({ name: "claimed" });
            return true;
        }

        if (JSON.stringify(e).includes("expired")) {
            router.push({ name: "expired" });
            return true;
        }

        return false;
    }

    return true;
}


// Main entry point
(async () => {
    const { Mnemonic, MnemonicPhrase, MnemonicLanguage, getWords } = Secret;
    const entropy = Buffer.from(base58.decode(props.entropy));
    const phrase = Mnemonic.toMnemonic(entropy, getWords(MnemonicLanguage.English));
    const keyphrase = new MnemonicPhrase(phrase);

    const env = {
        keyphrase: keyphrase.getPhrase(),
        mint: Kin.Mint,
        subsidizer: Code.Subsidizer,
    } as AppConfig;

    const account = await TimelockAccount.derivePrimary(env);
    const secret = keyphrase.getWords().join(' ');

    info(account, secret);

    await init(account);

    const amount = Kin.ToQuarks(Number(account.getCachedBalance()));
    const payload = Kik.Payload.fromKin(
        { quarks: BigInt(amount) }, // Kin Amount (as quarks)
        Kik.Kind.GiftCard           // Payload Kind
    ).toBinary();

    balance.value = Number(Kin.FromQuarks(amount));
    kikcode.value = await Kik.encode(payload);

    if (kikcode.value && balance.value === 0) {
        return router.push({ name: "claimed" });
    }

    setTimeout(() => { safariSwap.value = true; }, 450);
    setTimeout(() => { isLoading.value = false; }, 100);

    const rendezvousKey = Kik.deriveRendezvousKey(payload);

    let success = false;
    while (!success) {
        isScanned.value = false;

        // Wait for the user to scan the code, keep trying until they do
        success = await attemptRemoteSend(rendezvousKey, account, amount, env);
    }
})();

window.addEventListener("resize", () => { qrShow.value = false; });

//@ts-ignore
window.scanned = isScanned;

</script>

<template>
    <div class="min-h-screen flex flex-col">
        <SectionHeader :glow="true" :loading="isLoading" />

        <div class="flex items-center justify-center" :class="UserAgent.isMobileDevice() ?
            'max-w-sm mx-auto grid h-screen place-items-center -mt-2' :
            'max-w-[40vh] pt-10 pt-0 m-auto h-full'
            ">

            <div v-if="kikcode && balance > 0">
                <div v-if="UserAgent.isMobileDevice()" class="pb-5 text-white text-[32px] text-center leading-tight
                tracking-tighter font-medium font-avenir-next-bold
                relative delay-show-1">Someone sent you cash</div>

                <div v-else class="pb-14 text-white text-[2.4vh] text-center leading-tight
                tracking-tighter font-medium font-avenir-next-bold
                relative delay-show-1">Open the Code app and point your camera to grab this cash</div>

                <div class="relative">
                    <Transition name="fade">
                        <div v-if="!isScanned" :class="{ 'mv-right-end': qrShow }"
                            class="absolute top-[15vh] right-0 max-w-[21vh] mv-right-start">
                            <div v-if="qrDownloadLink" class="text-center">
                                <div
                                    class="text-white text-[1.4vh] text-center leading-tight font-medium font-avenir-next-bold">
                                    Scan this QR code with your phone’s camera to download the Code Wallet app
                                </div>

                                <div class="mt-5 flex items-center justify-center">
                                    <img :src="qrDownloadLink" class="w-[16vh] h-[16vh]" />
                                </div>
                            </div>
                        </div>
                    </Transition>


                    <div v-if="UserAgent.isMobileDevice()" class="flex items-center justify-center relative
                        pointer-events-none z-10 delay-show-2">
                        <CodeWalletBill :payload="kikcode" :scanned="isScanned" :amount="balance" />
                    </div>

                    <div v-else :class="{ 'mv-left-end': qrShow, }" class="flex items-center justify-center relative
                        mv-left-start pointer-events-none z-10 bill-opacity">
                        <div class="bill-bounce">
                            <CodeWalletBill :payload="kikcode" :scanned="isScanned" :amount="balance" />
                        </div>
                    </div>

                </div>

                <div v-if="UserAgent.isMobileDevice()" class="text-white text-center leading-tight font-medium
                    font-avenir-next-bold w-full relative text-[14px]">

                    <RouterLink :to="{ name: 'download' }" class="mt-6 block rounded-md bg-white
                    py-4 text-base font-semibold text-[#0f0c1f]
                    shadow-sm w-full delay-show-3">Collect This Cash</RouterLink>

                </div>

                <div v-else class="text-white text-center leading-tight font-medium
                    font-avenir-next-bold w-full relative text-[1.4vh] delay-long ">

                    <div class="mt-16">
                        Don’t have the Code Wallet app?

                        <a href="#" class="underline hidden sm:block" @click.prevent="showDownloadImage">Download It Now</a>

                        <a href="https://www.getcode.com/download" target="_blank" class="underline block sm:hidden
                        ">Download It Now</a>
                    </div>
                </div>
            </div>
        </div>

        <SectionFooter v-if="!UserAgent.isMobileDevice()" />
    </div>
</template>

<style scoped>
.mv-right-start {
    transition: all 0.3s ease-out;
    transform: scale(0.8);
    opacity: 0;

}

.mv-right-end {
    transform: translateX(13vh);
    opacity: 1;
}

.mv-left-start {
    transition: all 0.3s ease-out;
}

.mv-left-end {
    transform: scale(0.9) translateX(-13vh);
    opacity: 1;
}

@keyframes fade {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.bill-opacity {
    opacity: 0;
    animation: fade 0.45s ease-out 0.1s forwards;
}

.bill-bounce {
    transform: scale(0.6);
    animation: pop 0.45s linear(0, 0.67793 0.01%, 0.70702 1.26%, 0.7582 2.65%, 1.06306 9.091%,
            1.11795 10.871%, 1.14755 12.611%, 1.15324 13.471%, 1.1533 14.341%,
            1.13654 16.202%, 1.10139 18.102%, 0.96192 24.192%, 0.93228 26.333%,
            0.92023 28.443%, 0.92146 29.893%, 0.93014 31.463%, 1.01182 39.104%,
            1.02627 41.204%, 1.03255 43.274%, 1.02807 46.425%, 0.98852 54.095%,
            0.97849 58.236%, 0.98079 61.516%, 0.99924 68.857%, 1.00436 72.677%,
            1.00367 76.268%, 0.99199 88.109%, 0.99732 99.99%, 1) 0.1s forwards;
}

@keyframes pop {
    0% {
        transform: scale(0.6);
    }

    100% {
        transform: scale(1);
    }
}

.delay-long {
    opacity: 0;
    animation: fade 2s ease-in-out 1.5s forwards;
}

@keyframes fade-slide {
    0% {
        opacity: 0;
        transform: translateY(-0.5vh);
    }

    100% {
        opacity: 1;
    }
}

.delay-show-1 {
    opacity: 0;
    animation: fade-slide 0.5s ease-out 0s forwards;
}

.delay-show-2 {
    opacity: 0;
    animation: fade-slide 0.5s ease-out 0.5s forwards;
}

.delay-show-3 {
    opacity: 0;
    animation: fade-slide 0.5s ease-out 1.0s forwards;
}

.delay-show-4 {
    opacity: 0;
    animation: fade-slide 0.5s ease-out 1.5s forwards;
}
</style>
