# multiplicative.py

def Multiplicative_Inverse(a, m):
    a = a % m
    for x in range(1, m):
        if (a * x) % m == 1:
            return x
    return None  # Inverse doesn't exist

def Multiplicative_Encryption(plaintext, key):
    result = ""
    for ch in plaintext.upper():
        if ch.isalpha():
            p = ord(ch) - 65
            c = (p * key) % 26
            result += chr(c + 65)
        else:
            result += ch
    return result

def Multiplicative_Decryption(ciphertext, key):
    inverse = Multiplicative_Inverse(key, 26)
    if inverse is None:
        return "Invalid key. No modular inverse exists."
    result = ""
    for ch in ciphertext.upper():
        if ch.isalpha():
            c = ord(ch) - 65
            p = (c * inverse) % 26
            result += chr(p + 65)
        else:
            result += ch
    return result
