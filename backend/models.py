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

#
# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True)
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String)
#     is_active = Column(Boolean, default=True)

#     items = relationship("Item", back_populates="owner")


# class Item(Base):
#     __tablename__ = "items"

#     id = Column(Integer, primary_key=True)
#     title = Column(String, index=True)
#     description = Column(String, index=True)
#     owner_id = Column(Integer, ForeignKey("users.id"))

#     owner = relationship("User", back_populates="items")
