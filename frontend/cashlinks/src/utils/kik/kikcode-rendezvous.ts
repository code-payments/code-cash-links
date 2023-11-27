import { sha256 } from '@noble/hashes/sha256';
import { Keypair } from '@solana/web3.js'

function deriveRendezvousKey(payload: Uint8Array): Uint8Array {
    return Keypair.fromSeed(sha256(payload)).publicKey.toBytes();
}

function deriveRendezvousPrivateKey(payload: Uint8Array): Keypair {
    return Keypair.fromSeed(sha256(payload));
}

export {
    deriveRendezvousKey,
    deriveRendezvousPrivateKey,
};