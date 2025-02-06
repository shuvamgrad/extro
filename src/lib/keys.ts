// import * as buffer from "node:buffer";
import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
// window.Buffer = buffer.Buffer;
/**
 * Generates a new Solana keypair and returns the public and secret keys.
 * @returns {Object} An object containing the public key and the secret key as Base58 encoded strings.
 */
export function generateKeypair(): { publicKey: string; secretKey: string } {
  const keypair = web3.Keypair.generate();

  const publicKeyBase58 = keypair.publicKey.toBase58();
  const secretKeyBase58 = bs58.encode(keypair.secretKey);

  return {
    publicKey: publicKeyBase58,
    secretKey: secretKeyBase58,
  };
}

const RPC_URLS = {
  mainnet: "https://mainet-rpc.shyft.to?api_key=xFPjjtlPCDbtpfWT",
  devnet: "https://devnet-rpc.shyft.to?api_key=xFPjjtlPCDbtpfWT",
};

const connection = new web3.Connection(RPC_URLS.devnet, "confirmed");

export function getKeyPairFromSK(secretKey: string): {
  publicKey: string;
  secretKey: string;
} {
  const secretKey_obj = bs58.decode(secretKey);
  const keypair = web3.Keypair.fromSecretKey(secretKey_obj);
  const publicKeyBase58 = keypair.publicKey.toBase58();
  return {
    publicKey: publicKeyBase58,
    secretKey: secretKey,
  };
}

export async function sendSol(
  from_privateKey: string,
  to_publicKey: string,
  amountSol: number
) {
  // Decode the private key and validate
  const from_privateKey_obj = bs58.decode(from_privateKey);
  if (!from_privateKey_obj || from_privateKey_obj.length !== 64) {
    throw new Error("Invalid private key format");
  }

  const from = web3.Keypair.fromSecretKey(from_privateKey_obj);

  const from_publicKey = from.publicKey;

  if (!from_publicKey) {
    throw new Error("from_publicKey is null");
  }
  // const from_publicKey_obj = new web3.PublicKey(from_publicKey);
  // const to_publicKey_obj = new web3.PublicKey(to_publicKey);
  // const lamports = web3.LAMPORTS_PER_SOL * amountSol;

  const transaction = new web3.Transaction();

  // const transaction_instruction = web3.SystemProgram.transfer({
  //   fromPubkey: from_publicKey,
  //   toPubkey: to_publicKey_obj,
  //   lamports: lamports,
  // });
  //

  // Sign transaction, broadcast, and confirm

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
  );
  return signature;
}
