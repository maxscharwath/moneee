import { hmac } from "@noble/hashes/hmac";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";
import type { Input } from "@noble/hashes/utils";
import * as secp256k1 from "@noble/secp256k1";

export { sha256 } from "@noble/hashes/sha256";
export { bytesToHex, hexToBytes } from "@noble/hashes/utils";
export { base58 } from "@describble/base-x";

/**
 * Generates a new private key.
 */
export function generatePrivateKey(seed?: Uint8Array) {
	return seed
		? secp256k1.etc.hashToPrivateKey(seed)
		: secp256k1.utils.randomPrivateKey();
}

/**
 * Derives a new private key based on a master private key and a seed.
 * @param masterPrivateKey - The original master private key (Uint8Array).
 * @param seed - A unique seed (Uint8Array | string) used to derive the new private key.
 * @returns A derived private key (Uint8Array).
 */
export function derivePrivateKey(
	masterPrivateKey: Uint8Array,
	seed: Input,
): Uint8Array {
	return hmac(sha256, masterPrivateKey, seed);
}

/**
 * Gets the public key from a private key.
 * @param privateKey - The private key to get the public key from.
 * @returns The public key.
 */
export function getPublicKey(privateKey: Uint8Array) {
	return secp256k1.getPublicKey(privateKey, true);
}

/**
 * Verify the provided public key.
 * @remarks Check that public key is 33 or 65 bytes long
 * @param publicKey - The public key to verify.
 */
export function validatePublicKey(publicKey: Uint8Array) {
	return publicKey.byteLength === 33 || publicKey.byteLength === 65;
}

/**
 * Generates a new key pair.
 * @returns An object containing the privateKey and publicKey.
 */
export function generateKeyPair(seed?: Uint8Array) {
	const privateKey = generatePrivateKey(seed);
	const publicKey = getPublicKey(privateKey);
	return { privateKey, publicKey };
}

/**
 * Generates a new AES key based on the provided secret and salt.
 * @param secret - The secret used in the generation of the AES key.
 * @param salt - An optional salt to add randomness to the generation of the AES key.
 */
export async function generateAESKey(
	secret: Uint8Array | string,
	salt: Uint8Array | string,
) {
	return crypto.subtle.importKey(
		"raw",
		await pbkdf2Async(sha256, secret, salt, { c: 10000, dkLen: 32 }),
		{ name: "AES-GCM" },
		false,
		["encrypt", "decrypt"],
	);
}

/**
 * Generates an AES key based on the provided private key, public key and an optional salt.
 * @param privateKey - The private key used in the generation of the AES key.
 * @param publicKey - The public key used in the generation of the AES key.
 * @param salt - An optional salt to add randomness to the generation of the AES key.
 * @returns A Promise that resolves with the generated AES key.
 */
export async function generateSharedAESKey(
	privateKey: Uint8Array,
	publicKey: Uint8Array,
	salt: Uint8Array | string,
) {
	const secret = secp256k1.getSharedSecret(privateKey, publicKey);
	return generateAESKey(secret, salt);
}

/**
 * Encrypts the provided data using the provided secret.
 * @param data - The data to be encrypted.
 * @param secret - The secret used in the encryption.
 * @returns A Promise that resolves with the encrypted data.
 */
export async function encryptData(
	data: Uint8Array,
	secret: Uint8Array | string,
) {
	return encrypt(data, async (salt) => generateAESKey(secret, salt));
}

/**
 * Decrypts the provided data using the provided secret.
 * @param data - The data to be decrypted.
 * @param secret - The secret used in the decryption.
 * @returns A Promise that resolves with the decrypted data.
 */
export async function decryptData(
	data: Uint8Array,
	secret: Uint8Array | string,
) {
	return decrypt(data, async (salt) => generateAESKey(secret, salt));
}

/**
 * Encrypts a message using the provided private key, public key and the AES-GCM mode.
 * @param data - The data to be encrypted.
 * @param privateKey - The private key used in the encryption.
 * @param publicKey - The public key used in the encryption.
 * @returns A Promise that resolves with the encrypted data.
 */
export async function encryptMessage(
	data: Uint8Array,
	privateKey: Uint8Array,
	publicKey: Uint8Array,
) {
	return encrypt(data, async (salt) =>
		generateSharedAESKey(privateKey, publicKey, salt),
	);
}

/**
 * Decrypts a message using the provided private key, public key and the AES-GCM mode.
 * @param data - The data to be decrypted.
 * @param privateKey - The private key used in the decryption.
 * @param publicKey - The public key used in the decryption.
 * @returns A Promise that resolves with the decrypted data.
 */
export async function decryptMessage(
	data: Uint8Array,
	privateKey: Uint8Array,
	publicKey: Uint8Array,
) {
	return decrypt(data, async (salt) =>
		generateSharedAESKey(privateKey, publicKey, salt),
	);
}

/**
 * Fast encrypts the provided data using the provided secret.
 * @remarks This function is faster than encryptData, but it is less secure.
 * @param data - The data to be encrypted.
 * @param secret - The secret used in the encryption.
 */
export async function fastEncryptData(
	data: Uint8Array,
	secret: Uint8Array | string,
) {
	const iv = crypto.getRandomValues(new Uint8Array(16));
	const key = await crypto.subtle.importKey(
		"raw",
		await pbkdf2Async(sha256, secret, iv, { c: 1000, dkLen: 16 }),
		{ name: "AES-CBC" },
		false,
		["encrypt"],
	);
	const ciphertext = new Uint8Array(
		await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, data),
	);
	return concatBytes(iv, ciphertext);
}

/**
 * Fast decrypts the provided data using the provided secret.
 * @remarks This function is faster than decryptData, but it is less secure.
 * @param data
 * @param secret
 */
export async function fastDecryptData(
	data: Uint8Array,
	secret: Uint8Array | string,
) {
	const iv = data.subarray(0, 16);
	const ciphertext = data.subarray(16);
	const key = await crypto.subtle.importKey(
		"raw",
		await pbkdf2Async(sha256, secret, iv, { c: 1000, dkLen: 16 }),
		{ name: "AES-CBC" },
		false,
		["decrypt"],
	);
	return new Uint8Array(
		await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, ciphertext),
	);
}

/**
 * Creates a signature for the provided message using the provided private key.
 * The message is hashed using SHA-256 before being signed.
 * @param message - The non-hashed message to be signed.
 * @param privateKey - The private key used in the signing.
 */
export function createSignature(message: Uint8Array, privateKey: Uint8Array) {
	return secp256k1.sign(sha256(message), privateKey).toCompactRawBytes();
}

/**
 * Verifies the provided signature for the provided message using the provided public key.
 * The message is hashed using SHA-256 before being verified.
 * @param message - The non-hashed message that was signed.
 * @param signature - The signature to be verified.
 * @param publicKey - The public key used in the verification.
 */
export function verifySignature(
	message: Uint8Array,
	signature: Uint8Array,
	publicKey: Uint8Array,
) {
	return secp256k1.verify(signature, sha256(message), publicKey);
}

/**
 * Checks if the provided buffers are equal.
 * @param a - The first Uint8Array.
 * @param b - The second Uint8Array.
 */
export function bytesEquals(a: Uint8Array, b: Uint8Array) {
	return b.byteLength === a.byteLength
		? a.every((value, index) => value === b[index])
		: false;
}

/**
 * Merges the provided Uint8Arrays into a single Uint8Array.
 * @param arrays - The Uint8Arrays to be merged.
 * @returns The merged Uint8Array.
 */
export function concatBytes(...arrays: Uint8Array[]) {
	const result = new Uint8Array(arrays.reduce((a, b) => a + b.byteLength, 0));
	let offset = 0;
	for (const array of arrays) {
		result.set(array, offset);
		offset += array.byteLength;
	}
	return result;
}

/**
 * Hashes multiple Uint8Arrays using SHA-256.
 * @param data - The Uint8Arrays to be hashed.
 * @returns The hash.
 */
export function sha256Some(...data: Uint8Array[]) {
	return sha256(concatBytes(...data));
}

async function encrypt(
	data: Uint8Array,
	key: (salt: Uint8Array) => PromiseLike<CryptoKey>,
) {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const ciphertext = new Uint8Array(
		await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await key(salt), data),
	);
	return concatBytes(iv, salt, ciphertext);
}

async function decrypt(
	data: Uint8Array,
	key: (salt: Uint8Array) => PromiseLike<CryptoKey>,
) {
	const iv = data.subarray(0, 12);
	const salt = data.subarray(12, 28);
	const ciphertext = data.subarray(28);
	return new Uint8Array(
		await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv },
			await key(salt),
			ciphertext,
		),
	);
}

// Allow hmacSha256Sync
secp256k1.etc.hmacSha256Sync = (k, ...m) => hmac(sha256, k, concatBytes(...m));
