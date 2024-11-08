// Import the required modules
const { generateMnemonic } = require('./generateMnemonics');  // Adjust path as needed
const generateDogecoinAddress = require('./generateDogecoinAddress');
const generateCasePermutations = require('./casePermutations');

// Get the target string from command-line arguments
const targetString = process.argv[2];  // Use the first command-line argument as the target string

if (!targetString) {
    console.error("Please provide a target string as an argument.");
    process.exit(1);
}

// Generate all case permutations of the target string
const targetPermutations = generateCasePermutations(targetString);
console.log("Target Permutations:", targetPermutations);

// Define supported languages with corresponding keys for iteration
const languages = [
    'english',
    'chinese_simplified',
    'chinese_traditional',
    'japanese',
    'french',
    'italian',
    'korean',
    'spanish',
    'portuguese',
    'czech'
];

// Define supported word counts for strengths
const strengths = [12, 15, 18, 21, 24];

// Flag to indicate when a match is found
let matchFound = false;

// Counters for iterations, language, and strength indices
let iterationCount = 0;
let languageIndex = 0;
let strengthIndex = 0;

// Function to generate mnemonics and check the Dogecoin address for any target permutation
function generateInfinity() {
    if (matchFound) {
        console.log("Match found, stopping the process.");
        return;
    }

    // Get current language and strength
    const language = languages[languageIndex];
    const words = strengths[strengthIndex];

    // Generate a mnemonic with the current language and strength
    const mnemonic = generateMnemonic(language, words);
    const { address, wif } = generateDogecoinAddress(mnemonic);

    // Print mnemonic and WIF every 10,000 iterations
    iterationCount++;
    if (iterationCount % 10000 === 0) {
        console.log("-----------Top------------------");
        console.log(`Iteration ${iterationCount}:`);
        console.log(`Language: ${language}, Words: ${words}`);
        console.log(`Generated Mnemonic: ${mnemonic}`);
        console.log(`Address: ${address}`);
        console.log(`Wallet Import Format (WIF): ${wif}`);
        console.log("--------------End---------------");
    }

    // Check if the generated Dogecoin address contains any of the target permutations
    for (let perm of targetPermutations) {
        if (address.includes(perm)) {
            console.log("-----------------------------");
            console.log(`Iteration ${iterationCount}:`);
            console.log(`Target String Match Found in Address! Address: ${address}`);
            console.log(`Generated Mnemonic: ${mnemonic}`);
            console.log(`Wallet Import Format (WIF): ${wif}`);
            console.log("-----------------------------");

            // Set match found to true and stop the generation loop
            matchFound = true;
            return;
        }
    }

    // Move to the next strength and language after each iteration
    strengthIndex++;
    if (strengthIndex >= strengths.length) {
        strengthIndex = 0;
        languageIndex = (languageIndex + 1) % languages.length;
    }

    // Schedule the next generation immediately after the current one finishes
    setImmediate(generateInfinity);
}

// Start generating infinitely
generateInfinity();
