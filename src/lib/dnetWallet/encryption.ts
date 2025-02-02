import sodium from 'libsodium-wrappers';
import bs58 from 'bs58';
import pako from 'pako';

export async function encryptMessage(
  rawMessage: string,
  nonce: Uint8Array,
  recipients: string[]
): Promise<{ encryptedData: string; encryptionKeys: string }> {
  await sodium.ready;

  const sharedKey = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
  const encryptedData = sodium.crypto_secretbox_easy(sodium.from_string(rawMessage), nonce, sharedKey);
  const compressedEncryptedData = Buffer.from(pako.deflate(encryptedData)).toString('base64');

  const encryptedKeys: Record<string, string> = {};
  for (const recipient of recipients) {
    if (typeof recipient !== 'string') {
      throw new Error('Recipient must be a Base58-encoded string');
    }

    const ed25519PublicKey = bs58.decode(recipient);
    const curve25519PublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(ed25519PublicKey);
    const encryptedSharedKey = sodium.crypto_box_seal(sharedKey, curve25519PublicKey);
    encryptedKeys[recipient] = Buffer.from(pako.deflate(encryptedSharedKey)).toString('base64');
  }

  const compressedKeys = compressAndEncode(JSON.stringify(encryptedKeys));

  return {
    encryptedData: compressedEncryptedData,
    encryptionKeys: compressedKeys,
  };
}

export async function decryptMessage(
  encryptedData: string,
  encryptionKeys: string,
  nonce: Uint8Array,
  receiverPublicKeyBase58: string,
  receiverPrivateKeyBase58: Uint8Array
): Promise<string> {
  await sodium.ready;

  const ed25519PublicKey = bs58.decode(receiverPublicKeyBase58);
  const curve25519PublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(ed25519PublicKey);
  const curve25519PrivateKey = sodium.crypto_sign_ed25519_sk_to_curve25519(receiverPrivateKeyBase58);

  const compressedKeys = decodeAndDecompress(encryptionKeys);
  const encryptionKeysMap = JSON.parse(compressedKeys);

  const compressedSharedKeyBase64 = encryptionKeysMap[receiverPublicKeyBase58];
  if (!compressedSharedKeyBase64) {
    throw new Error('No encrypted shared key found for this recipient.');
  }

  const compressedSharedKey = Buffer.from(compressedSharedKeyBase64, 'base64');
  const encryptedSharedKey = pako.inflate(compressedSharedKey);

  const sharedKey = sodium.crypto_box_seal_open(encryptedSharedKey, curve25519PublicKey, curve25519PrivateKey);
  if (!sharedKey) {
    throw new Error('Failed to decrypt the shared key.');
  }

  const compressedEncryptedData = Buffer.from(encryptedData, 'base64');
  const encryptedMessage = pako.inflate(compressedEncryptedData);
  const decryptedMessage = sodium.crypto_secretbox_open_easy(encryptedMessage, nonce, sharedKey);

  if (!decryptedMessage) {
    throw new Error('Failed to decrypt the message.');
  }

  return new TextDecoder().decode(decryptedMessage);
}

function compressAndEncode(data: string): string {
  return Buffer.from(pako.deflate(Buffer.from(data))).toString('base64');
}

function decodeAndDecompress(data: string): string {
  return Buffer.from(pako.inflate(Buffer.from(data, 'base64'))).toString();
}
