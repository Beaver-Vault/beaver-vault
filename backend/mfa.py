import pyotp


def create_qrcode_url(secret, email):
    return f'otpauth://totp/{email}?secret={secret}&issuer=Beaver Vault'


def verify_mfa(secret, mfa_code):
    totp = pyotp.TOTP(secret)
    return totp.verify(mfa_code)
