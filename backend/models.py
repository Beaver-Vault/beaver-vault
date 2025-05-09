from sqlalchemy import (Boolean, Column, ForeignKey, Integer, String,
                        DateTime, func)
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base
import pyotp


class User(Base):
    __tablename__ = "Users"

    userID = Column(UUID, primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    hashedMasterKey = Column(String)
    accountCreationDate = Column(DateTime, default=func.now())
    lastLoginDate = Column(DateTime, default=func.now())
    totpKey = Column(String, default=pyotp.random_base32)

    def get_totpKey(self):
        return self.totpKey


class Folder(Base):
    __tablename__ = "Folders"

    folderID = Column(UUID, primary_key=True, default=uuid.uuid4)
    folderName = Column(String)
    userID = Column(UUID, ForeignKey("Users.userID"))


class Passwords(Base):
    __tablename__ = "Passwords"

    passwordID = Column(UUID, primary_key=True, default=uuid.uuid4)
    websiteName = Column(String(100))
    username = Column(String(256))
    encryptedPassword = Column(String(256))
    folderID = Column(UUID, ForeignKey("Folders.folderID"))
    trashBin = Column(Boolean, default=False)
    deletionDateTime = Column(DateTime, nullable=True)


class CreditCard(Base):
    __tablename__ = "CreditCards"

    creditcardID = Column(UUID, primary_key=True, default=uuid.uuid4)
    cardName = Column(String(256))
    cardholderName = Column(String(256))
    number = Column(Integer)
    expiration = Column(Integer)
    csv = Column(Integer)
    folderID = Column(UUID, ForeignKey("Folders.folderID"))
    trashBin = Column(Boolean, default=False)
    deletionDateTime = Column(DateTime, nullable=True)


class Note(Base):
    __tablename__ = "Notes"

    noteID = Column(UUID, primary_key=True, default=uuid.uuid4)
    noteName = Column(String(256))
    content = Column(String(1024))
    folderID = Column(UUID, ForeignKey("Folders.folderID"))
    trashBin = Column(Boolean, default=False)
    deletionDateTime = Column(DateTime, nullable=True)
