const bip39 = require('bip39');

// Define supported languages with corresponding wordlists
const languages = {
    english: bip39.wordlists.english,
    chinese_simplified: bip39.wordlists.chinese_simplified,
    chinese_traditional: bip39.wordlists.chinese_traditional,
    japanese: bip39.wordlists.japanese,
    french: bip39.wordlists.french,
    italian: bip39.wordlists.italian,
    korean: bip39.wordlists.korean,
    spanish: bip39.wordlists.spanish,
    portuguese: bip39.wordlists.portuguese,
    czech: bip39.wordlists.czech,
};

/**
 * Generate a mnemonic phrase.
 *
 * @param {string} language - The language for the mnemonic.
 * @param {number} words - The number of words (12, 15, 18, 21, 24).
 * @returns {string} The generated mnemonic.
 */
function generateMnemonic(language = 'english', words = 12) {
    const validWordCounts = {
        12: 128,
        15: 160,
        18: 192,
        21: 224,
        24: 256,
    };
    
    if (!validWordCounts[words]) {
        throw new Error('Invalid word count. Valid options are: 12, 15, 18, 21, 24.');
    }

    // Generate the mnemonic in the specified language and word count
    const entropy = validWordCounts[words];
    const mnemonic = bip39.generateMnemonic(entropy, null, languages[language]);

    return mnemonic;
}

// Export the function
module.exports = { generateMnemonic };
