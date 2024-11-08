// Function to generate all case permutations of a given string
function generateCasePermutations(str) {
    // Helper function to generate permutations using recursion
    function getPermutations(chars) {
        if (chars.length === 0) return [''];
        const firstChar = chars[0];
        const restPermutations = getPermutations(chars.slice(1));

        return [
            ...restPermutations.map(perm => firstChar.toLowerCase() + perm),
            ...restPermutations.map(perm => firstChar.toUpperCase() + perm)
        ];
    }

    return getPermutations(str.split(''));
}

// Export the function so it can be used in other files
module.exports = generateCasePermutations;
