// Import the required modules
const generateMnemonic = require('./generateMnemonics');
const generateDogecoinAddress = require('./generateDogecoinAddress');
const generateCasePermutations = require('./casePermutations');

// Target string you want to match against the Dogecoin address
const targetString = "turjaun";  // Replace with your desired target string

// Generate all case permutations of the target string
const targetPermutations = generateCasePermutations(targetString);

console.log("Target Permutations: ", targetPermutations);

// Flag to indicate when a match is found
let matchFound = false;

// Counter for iterations
let iterationCount = 0;

// Function to generate mnemonics and check the Dogecoin address for any target permutation
function generateInfinity() {
    // Infinite loop to generate mnemonics and Dogecoin addresses
    const intervalId = setInterval(() => {
        if (matchFound) {
            clearInterval(intervalId);  // Stop the interval once a match is found
            console.log("Match found, stopping the process.");
            return;
        }

        // Generate a mnemonic
        const mnemonic = generateMnemonic();
        const { address, wif } = generateDogecoinAddress(mnemonic);

        // Print mnemonic and WIF every 10,000 iterations
        iterationCount++;
        if (iterationCount % 10000 === 0) {
            console.log(`Iteration ${iterationCount}:`);
            console.log(`Generated Mnemonic: ${mnemonic}`);
            console.log(`Wallet Import Format (WIF): ${wif}`);
        }

        // Check if the generated Dogecoin address contains any of the target permutations
        for (let perm of targetPermutations) {
            if (address.includes(perm)) {
                console.log("-----------------------------");
                console.log(`Target String Match Found in Address! Address: ${address}`);
                console.log(`Generated Mnemonic: ${mnemonic}`);
                console.log(`Wallet Import Format (WIF): ${wif}`);
                console.log("-----------------------------");

                // Set match found to true and stop the generation loop
                matchFound = true;
                break;  // Exit the loop once a match is found
            }
        }
    }, 0);  // Set interval of 0ms for better performance
}

// Start generating infinitely
generateInfinity();
