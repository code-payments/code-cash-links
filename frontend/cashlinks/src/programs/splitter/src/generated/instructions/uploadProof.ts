/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category UploadProof
 * @category generated
 */
export type UploadProofInstructionArgs = {
  poolBump: number
  proofBump: number
  currentSize: number
  dataSize: number
  data: number[] /* size: 32 */[]
}
/**
 * @category Instructions
 * @category UploadProof
 * @category generated
 */
const uploadProofStruct = new beet.FixableBeetArgsStruct<
  UploadProofInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['poolBump', beet.u8],
    ['proofBump', beet.u8],
    ['currentSize', beet.u8],
    ['dataSize', beet.u8],
    ['data', beet.array(beet.uniformFixedSizeArray(beet.u8, 32))],
  ],
  'UploadProofInstructionArgs'
)
/**
 * Accounts required by the _uploadProof_ instruction
 * @category Instructions
 * @category UploadProof
 * @category generated
 */
export type UploadProofInstructionAccounts = {
  pool: web3.PublicKey
  proof: web3.PublicKey
  authority: web3.PublicKey
  payer: web3.PublicKey
}

const uploadProofInstructionDiscriminator = [57, 235, 171, 213, 237, 91, 79, 2]

/**
 * Creates a _UploadProof_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category UploadProof
 * @category generated
 */
export function createUploadProofInstruction(
  accounts: UploadProofInstructionAccounts,
  args: UploadProofInstructionArgs
) {
  const { pool, proof, authority, payer } = accounts

  const [data] = uploadProofStruct.serialize({
    instructionDiscriminator: uploadProofInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: pool,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: proof,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: authority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: payer,
      isWritable: true,
      isSigner: true,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey(
      'spLit2eb13Tz93if6aJM136nUWki5PVUsoEjcUjwpwW'
    ),
    keys,
    data,
  })
  return ix
}
