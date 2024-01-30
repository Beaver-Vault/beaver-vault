from typing import Union
from pydantic import BaseModel


class User(BaseModel):
    userID: Union[str, None] = None
    email: str
    accountCreationDate: Union[str, None] = None
    lastLoginDate: Union[str, None] = None


# class UserBase(BaseModel):
#     username: str
#
#
# class UserCreate(UserBase):
#     password: str
#
#
# class User(UserBase):
#     id: int
#
#     class Config:
#         orm_mode = True
