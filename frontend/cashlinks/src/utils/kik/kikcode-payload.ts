/*
 
   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
 +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
 | T |            Amount             |                   Nonce                   |
 +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
 
 Type (T) (1 byte)

 The first byte of the data in all Code scan codes is reserved for the scan
 code type. This field indicates which type of scan code data is contained
 in the scan code. The expected format for each type is outlined below.
 
 Amount (8 bytes)

 This field indicates the number of quarks the payment is for. It should be
 represented as a 64-bit unsigned integer.

 Nonce (11 bytes)

 This field is an 11-byte randomly-generated nonce. It should be regenerated
 each time a new payment is initiated.
 
 */

enum Kind {
    Cash = 0,
    GiftCard = 1,
    RequestPayment = 2,
}

enum PayloadError {
    InvalidSize,
    InvalidKind,
}

interface Kin {
    quarks: bigint;
}

const ErrGenerateKikCode = (err: PayloadError) => new Error(`KikCodeError: ${err}`);
const newNonce = () => crypto.getRandomValues(new Uint8Array(11));

class Payload {
    kind: Kind;
    kin: Kin;
    nonce: Uint8Array;

    static readonly MAX_LENGTH: number = 20;

    constructor(kind: Kind, quarks: bigint, nonce: Uint8Array) {
        this.kind = kind;
        this.kin = { quarks };
        this.nonce = nonce;
    }

    toBinary(): Uint8Array {
        const data = new Uint8Array(20);
        data[0] = this.kind;

        for (let i = 0; i < 8; i++) {
            data[i + 1] = Number(this.kin.quarks >> BigInt(8 * i) & BigInt(0xFF));
        }

        data.set(this.nonce, 9);
        return data;
    }

    static nonce(): Uint8Array {
        return newNonce();
    }

    static fromKin(kin: Kin, kind: Kind = Kind.Cash): Payload {
        return new Payload(kind, kin.quarks, newNonce());
    }

    static fromData(data: Uint8Array): Payload {
        if (data.length !== Payload.MAX_LENGTH) {
            throw ErrGenerateKikCode(PayloadError.InvalidSize);
        }

        const type = data[0] as Kind;
        const amount = data.slice(1, 9).reduce((acc, val, i) => acc + (val << (8 * i)), 0);
        const nonce = data.slice(9);
        const quarks = BigInt(amount);

        return new Payload(type, quarks, nonce);
    }
}

export { Payload, Kind, PayloadError };