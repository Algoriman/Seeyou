from mnemonic import Mnemonic
import bip32utils
from hashlib import sha256
from Crypto.Hash import RIPEMD160
import base58
import itertools
import random

# Parameters
target_string = "turjaun"

# Generate all case variations of the target substring
case_permutations = [''.join(p) for p in itertools.product(*((c.lower(), c.upper()) for c in target_string))]

# Function to derive a Dogecoin address from a mnemonic
def generate_dogecoin_address(mnemonic):
    mnemo = Mnemonic("english")
    seed = mnemo.to_seed(mnemonic)

    bip32_root_key = bip32utils.BIP32Key.fromEntropy(seed)
    bip32_child_key = bip32_root_key.ChildKey(44 + bip32utils.BIP32_HARDEN) \
                                      .ChildKey(3 + bip32utils.BIP32_HARDEN) \
                                      .ChildKey(0 + bip32utils.BIP32_HARDEN) \
                                      .ChildKey(0) \
                                      .ChildKey(0)

    public_key = bip32_child_key.PublicKey()
    pubkey_hash = sha256(public_key).digest()
    
    # Use pycryptodome's RIPEMD160
    ripe = RIPEMD160.new()
    ripe.update(pubkey_hash)
    ripe_digest = ripe.digest()
    
    address = base58.b58encode_check(b'\x1e' + ripe_digest).decode()

    return address, bip32_child_key.WalletImportFormat()

# Initialize Mnemonic and start generating mnemonics
mnemo = Mnemonic("english")

print("Searching for an address containing any case variation of:", target_string)
attempts = 0

file_path = "dogecoin_address_match.txt"

with open(file_path, "w") as file:
    while True:
        strength = random.choice([128, 160, 192, 224, 256])
        mnemonic = mnemo.generate(strength=strength)
        address, private_key = generate_dogecoin_address(mnemonic)
        
        # Print the generated address for debugging
        

        # Check if the address contains any case variation of the target substring
        if any(variant in address for variant in case_permutations):
            output = (
                "\nMatch found!\n"
                f"Mnemonic: {mnemonic}\n"
                f"Private Key (WIF): {private_key}\n"
                f"Dogecoin Address: {address}\n"
            )
            print(output)
            file.write(output)
            break  # Exit the loop on match

        attempts += 1
        if attempts % 10000 == 0:
            print(f"Attempt {attempts}: Address: {address}")
            print(f"Mnemonic: {mnemonic}")
            print(f"Private Key (WIF): {private_key}")

# After breaking out of the loop, log total attempts
try:
    with open(file_path, "a") as file:
        file.write(f"\nTotal attempts: {attempts}\n")
    print(f"Total attempts: {attempts}")
except Exception as e:
    print(f"An error occurred while writing total attempts to the file: {e}")
  
