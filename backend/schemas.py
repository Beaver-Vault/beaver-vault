from typing import Union, Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class User(BaseModel):
    userID: Optional[UUID] = None
    email: str
    hashedMasterKey: str
    accountCreationDate: Optional[datetime] = None
    lastLoginDate: Optional[datetime] = None


class MFAVerify(BaseModel):
    email: str
    mfaCode: str


class Folder(BaseModel):
    folderID: Optional[UUID] = None
    folderName: str
    userID: UUID


class Password(BaseModel):
    passwordID: Optional[UUID] = None
    websiteName: str
    username: str
    encryptedPassword: str
    folderID: UUID
    trashBin: Optional[bool] = False
    deletionDateTime: Optional[datetime] = None


class CreditCard(BaseModel):
    creditcardID: Optional[UUID] = None
    cardName: str
    cardholderName: str
    number: str
    expiration: str
    csv: str
    folderID: UUID
    trashBin: Optional[bool] = False
    deletionDateTime: Optional[datetime] = None


class Note(BaseModel):
    noteID: Optional[UUID] = None
    noteName: str
    content: str
    folderID: UUID
    trashBin: Optional[bool] = False
    deletionDateTime: Optional[datetime] = None


class RefreshRequest(BaseModel):
    email: str
    refreshToken: str


class TrashBin(BaseModel):
    restore: bool
