from typing import Union, Optional
from pydantic import BaseModel
from datetime import datetime


class User(BaseModel):
    userID: Optional[int] = None
    email: str
    hashedMasterKey: str
    accountCreationDate: Optional[datetime] = None
    lastLoginDate: Optional[datetime] = None


class Folder(BaseModel):
    folderID: Optional[int] = None
    folderName: str
    userID: int
