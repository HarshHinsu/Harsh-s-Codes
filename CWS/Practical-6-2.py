# main.py

from multiplicative import Multiplicative_Encryption, Multiplicative_Decryption

print("Multiplicative Cipher")
choice = input("Type E to Encrypt or D to Decrypt: ").strip().upper()

text = input("Enter the text: ")
try:
    key = int(input("Enter the numeric key (coprime with 26): "))
except ValueError:
    print("Key must be a number.")
    exit()

if choice == 'E':
    print("Encrypted:", Multiplicative_Encryption(text, key))
elif choice == 'D':
    print("Decrypted:", Multiplicative_Decryption(text, key))
else:
    print("Invalid choice.")
