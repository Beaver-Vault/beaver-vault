from typing import Union, Optional
from pydantic import BaseModel
from datetime import datetime


class User(BaseModel):
    userID: Optional[int] = None
    email: str
    hashedMasterKey: str
    accountCreationDate: Optional[datetime] = None
    lastLoginDate: Optional[datetime] = None


class MFAVerify(BaseModel):
    email: str
    mfaCode: str


class Folder(BaseModel):
    folderID: Optional[int] = None
    folderName: str
    userID: int


class Password(BaseModel):
    passwordID: Optional[int] = None
    websiteName: str
    username: str
    encryptedPassword: str
    folderID: int


class CreditCard(BaseModel):
    creditcardID: Optional[int] = None
    cardName: str
    cardholderName: str
    number: str
    expiration: str
    csv: str
    folderID: int


class Note(BaseModel):
    noteID: Optional[int] = None
    noteName: str
    content: str
    folderID: int


class RefreshRequest(BaseModel):
    email: str
    refreshToken: str
