// generateMnemonics.js
const bip39 = require('bip39');

// Define the mnemonic generation function
function generateMnemonic() {
    // Define the desired mnemonic strengths in bits and their respective word counts
    const strengths = [
        { bits: 128, words: 12 },
        { bits: 160, words: 15 },
        { bits: 192, words: 18 },
        { bits: 224, words: 21 },
        { bits: 256, words: 24 }
    ];

    // Select a random strength
    const randomStrengthIndex = Math.floor(Math.random() * strengths.length);
    const { bits, words } = strengths[randomStrengthIndex];

    // Generate a mnemonic for the selected strength
    const mnemonic = bip39.generateMnemonic(bits);

    // Return the generated mnemonic
    return mnemonic;
}

// Export the function so it can be used in other files
module.exports = generateMnemonic;
