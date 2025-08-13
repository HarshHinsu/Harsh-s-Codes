import math

def encrypt(text, key):
    """Encrypts text using the additive cipher."""
    result = ""
    for char in text:
        if 'a' <= char <= 'z':
            result += chr(((ord(char) - ord('a') + key) % 26) + ord('a'))
        elif 'A' <= char <= 'Z':
            result += chr(((ord(char) - ord('A') + key) % 26) + ord('A'))
        else:
            result += char  # Non-alphabetic characters remain unchanged
           
    return result

def decrypt(text, key):
    """Decrypts text using the additive cipher."""
    result = ""
    for char in text:
        if 'a' <= char <= 'z':
            result += chr(((ord(char) - ord('a') - key) % 26) + ord('a'))
        elif 'A' <= char <= 'Z':
            result += chr(((ord(char) - ord('A') - key) % 26) + ord('A'))
        else:
            result += char  # Non-alphabetic characters remain unchanged
    return result

# Example Usage
plaintext = input("Enter a name:")
shift_key = int(input("Enter a KEY:"))

encrypted_text = encrypt(plaintext, shift_key)
print(f"Encrypted: {encrypted_text}")

decrypted_text = decrypt(encrypted_text, shift_key)
print(f"Decrypted: {decrypted_text}")