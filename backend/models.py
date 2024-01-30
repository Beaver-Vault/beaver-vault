from sqlalchemy import (Boolean, Column, ForeignKey, Integer, String,
                        DateTime, func)
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class User(Base):
    __tablename__ = "Users"

    userID = Column(Integer, primary_key=True, autoincrement=True,
                    server_default='1')
    email = Column(String, unique=True, index=True)
    hashedMasterKey = Column(String)
    accountCreationDate = Column(DateTime, default=func.now())
    lastLoginDate = Column(DateTime, default=func.now())


class Folder(Base):
    __tablename__ = "Folders"

    folderID = Column(Integer, primary_key=True, autoincrement=True,
                      server_default='1')
    folderName = Column(String)
    userID = Column(Integer, ForeignKey("Users.userID"))


class Passwords(Base):
    __tablename__ = "Passwords"

    passwordID = Column(Integer, primary_key=True, autoincrement=True)
    websiteName = Column(String(100))
    username = Column(String(256))
    encryptedPassword = Column(String(256))
    folderID = Column(Integer, ForeignKey("Folders.folderID"))


class CreditCard(Base):
    __tablename__ = "CreditCards"

    creditcardID = Column(Integer, primary_key=True, autoincrement=True)
    cardName = Column(String(256))
    cardholderName = Column(String(256))
    number = Column(Integer)
    expiration = Column(Integer)
    csv = Column(Integer)
    folderID = Column(Integer, ForeignKey("Folders.folderID"))


class Note(Base):
    __tablename__ = "Notes"

    noteID = Column(Integer, primary_key=True, autoincrement=True)
    noteName = Column(String(256))
    content = Column(String(1024))
    folderID = Column(Integer, ForeignKey("Folders.folderID"))

