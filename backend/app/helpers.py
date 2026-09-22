from email_validator import EmailNotValidError, validate_email

# Para password hashing
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

def check_and_normalize_email(*, email: str, check: bool) -> dict:
    try:

        email_info = validate_email(email, check_deliverability=check)

        email_normalized = email_info.normalized

        return {"email": email_normalized, "error": None}

    except EmailNotValidError as e:

        return {"email": None, "error": str(e)}

# -------------- PASSWORD HASHING -------------------

senha_hash = PasswordHash((Argon2Hasher(),))

def hashing_senha(senha: str):
    if not len(senha) > 10:
        return ValueError
    hash = senha_hash.hash(senha)
    return hash

    