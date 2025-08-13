import additive

def brute_force_additive(ciphertext):
    print(f"Enter Cipher text: {ciphertext}\n")
    for key in range(26):
        decrypted_text = additive.decrypt(ciphertext, key)
        print(f"Key= {key} Cipher: {decrypted_text}")

if __name__ == "__main__":
    # Example cipher text you want to decrypt; replace with any input as needed
    ciphertext = "WTAAD"
    brute_force_additive(ciphertext)
