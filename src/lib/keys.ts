import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

/**
 * Generates a new Solana keypair and returns the public and secret keys.
 * @returns {Object} An object containing the public key and the secret key as Base58 encoded strings.
 */
export function generateKeypair(): { publicKey: string; secretKey: string } {
  const keypair = Keypair.generate();

  const publicKeyBase58 = keypair.publicKey.toBase58();
  const secretKeyBase58 = bs58.encode(keypair.secretKey);

  return {
    publicKey: publicKeyBase58,
    secretKey: secretKeyBase58,
  };
}
