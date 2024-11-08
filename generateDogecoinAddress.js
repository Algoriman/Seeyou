const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const crypto = require('crypto');
const bs58 = require('bs58');
const ecc = require('tiny-secp256k1');
const elliptic = require('elliptic');

// Initialize bip32 with tiny-secp256k1
const bip32 = BIP32Factory(ecc);

// Create an instance of the secp256k1 elliptic curve
const ec = new elliptic.ec('secp256k1');

// Function to calculate checksum
function calculateChecksum(payload) {
    const first = crypto.createHash('sha256').update(payload).digest();
    const second = crypto.createHash('sha256').update(first).digest();
    return second.slice(0, 4);
}

// Function to encode with Base58Check
function base58Check(payload) {
    const checksum = calculateChecksum(payload);
    const encodedPayload = Buffer.concat([payload, checksum]);
    return bs58.default.encode(encodedPayload);
}

// Function to generate Dogecoin address from a mnemonic
function generateDogecoinAddress(mnemonic) {
    try {
        // Generate seed from mnemonic
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        
        // Use BIP32 to generate root key from seed
        const root = bip32.fromSeed(seed);

        // Derive the BIP32 child key for Dogecoin (m/44'/3'/0'/0/0)
        const childKey = root.derivePath("m/44'/3'/0'/0/0");

        // Get the public key
        const publicKey = childKey.publicKey;

        // Verify the public key is valid
        if (!ec.keyFromPublic(publicKey).validate()) {
            throw new Error('Invalid public key');
        }

        // Compute SHA256 hash of public key
        const sha256Hash = crypto.createHash('sha256').update(publicKey).digest();
        
        // Compute RIPEMD160 hash of the SHA256 hash
        const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();

        // Add Dogecoin version prefix (0x1E)
        const versionedHash = Buffer.concat([Buffer.from([0x1e]), ripemd160Hash]);

        // Encode address using Base58Check
        const address = base58Check(versionedHash);

        // Get private key in WIF format
        const privateKey = childKey.privateKey;
        const versionedPrivateKey = Buffer.concat([Buffer.from([0x9e]), privateKey, Buffer.from([0x01])]);
        const wif = base58Check(versionedPrivateKey);

        return {
            address,
            wif
        };
    } catch (error) {
        throw new Error(`Error generating Dogecoin address: ${error.message}`);
    }
}

module.exports = generateDogecoinAddress;