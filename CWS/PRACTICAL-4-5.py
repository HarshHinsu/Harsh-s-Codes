from ast import mod
import string

def encrypt_decrypt(text, mode, key):
    letters = string.ascii_lowercase
    num_letters = len(letters)
    result = ''

    key = key % num_letters
    if mode == 'd':
        key = -key

    for char in text:
        if char.isalpha():
            if char.isupper():
                start = ord('A')
            else:
                start = ord('a')

            new_position = (ord(char) - start + key) % 26
            result += chr(start + new_position)
        else:
            result += char

    return result


def decrypt_caesar_cipher(ciphertext, key):
    plaintext = ""
    for char in ciphertext:
        if 'a' <= char <= 'z':
            shifted_char_code = (ord(char) - ord('a') - key + 26) % 26
            plaintext += chr(ord('a') + shifted_char_code)
        elif 'A' <= char <= 'Z':
            shifted_char_code = (ord(char) - ord('A') - key + 26) % 26
            plaintext += chr(ord('A') + shifted_char_code)
        else:
            # Keep non-alphabetic characters (spaces, punctuation, numbers) as they are
            plaintext += char
    return plaintext


def brute_force_caesar_cipher_attack(ciphertext):
  print(f"Starting brute-force attack on ciphertext: '{ciphertext}'\n")
  print("--- Possible Decryptions (Attempting all 26 keys) ---")
  print("----------------------------------------------------")

    # Iterate through all possible keys from 0 to 25
  for key_guess in range(26):
      decrypted_text = decrypt_caesar_cipher(ciphertext, key_guess)
      print(f"Key {key_guess:2}: {decrypted_text}")

  print("----------------------------------------------------")
  print("\nBrute-force attack complete. Scan the list above for a readable message.")
  print("The key corresponding to the readable message is the correct decryption key.")

if __name__ == "__main__":
    key = int(input('Enter the key: '))
    text = input('Enter the text to encrypt: ')
    mode = input('Enter the mode (e=Encryption/d=Decryption): ')
    result = encrypt_decrypt(text, mode, key)
    print(result)
    ciphertext=result
    brute_force_caesar_cipher_attack(ciphertext)