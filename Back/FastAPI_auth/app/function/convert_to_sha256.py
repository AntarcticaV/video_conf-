import hashlib


def convert_to_sha256(string: str):
    byte_password = string.encode('utf-8')
    object_sha256 = hashlib.sha256()
    object_sha256.update(byte_password)
    return object_sha256.hexdigest()
