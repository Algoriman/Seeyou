// Import required libraries
const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const crypto = require('crypto');
const bs58 = require('bs58');
const ecc = require('tiny-secp256k1');
const elliptic = require('elliptic');

// Initialize bip32 and secp256k1 curve
const bip32 = BIP32Factory(ecc);
const ec = new elliptic.ec('secp256k1');

// Function to calculate checksum for Base58Check encoding
function calculateChecksum(payload) {
    const firstHash = crypto.createHash('sha256').update(payload).digest();
    const secondHash = crypto.createHash('sha256').update(firstHash).digest();
    return secondHash.slice(0, 4);
}

// Base58Check encoding
function base58Check(payload) {
    const checksum = calculateChecksum(payload);
    return bs58.default.encode(Buffer.concat([payload, checksum]));
}

/**
 * Generate a Dogecoin address from a mnemonic phrase.
 * 
 * @param {string} mnemonic - The BIP39 mnemonic phrase.
 * @returns {object} Object containing the Dogecoin address and WIF private key.
 */
function generateDogecoinAddress(mnemonic) {
    // Generate seed from the mnemonic
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    
    // Generate the BIP32 root and derive the Dogecoin address path
    const root = bip32.fromSeed(seed);
    const childKey = root.derivePath("m/44'/3'/0'/0/0");

    // Get the public key and verify it
    const publicKey = childKey.publicKey;
    if (!ec.keyFromPublic(publicKey).validate()) {
        throw new Error('Invalid public key');
    }

    // Generate Dogecoin address
    const sha256Hash = crypto.createHash('sha256').update(publicKey).digest();
    const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
    const versionedHash = Buffer.concat([Buffer.from([0x1e]), ripemd160Hash]);
    const address = base58Check(versionedHash);

    // Generate WIF (Wallet Import Format) private key
    const privateKey = childKey.privateKey;
    const versionedPrivateKey = Buffer.concat([Buffer.from([0x9e]), privateKey, Buffer.from([0x01])]);
    const wif = base58Check(versionedPrivateKey);

    return { address, wif };
}

// Export the function to make it easier to use
module.exports = generateDogecoinAddress;
