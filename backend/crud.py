from sqlalchemy.orm import Session

import models
import schemas


def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.userID == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.User):
    db_user = models.User(email=user.email, hashedMasterKey=user.hashedMasterKey)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_folder(db: Session, folder: schemas.Folder):
    db_folder = models.Folder(folderName=folder.folderName, userID=folder.userID)
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder

