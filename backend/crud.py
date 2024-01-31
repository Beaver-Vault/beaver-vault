from sqlalchemy.orm import Session

import models
import schemas

# Create (POST)

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


def create_password(db: Session, password: schemas.Password):
    db_password = models.Passwords(websiteName=password.websiteName, username=password.username, encryptedPassword=password.encryptedPassword, folderID=password.folderID)
    db.add(db_password)
    db.commit()
    db.refresh(db_password)
    return db_password


def create_note(db: Session, note: schemas.Note):
    db_note = models.Note(noteName=note.noteName, content=note.content, folderID=note.folderID)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


def create_creditcard(db: Session, creditcard: schemas.CreditCard):
    db_creditcard = models.CreditCard(cardName=creditcard.cardName, cardholderName=creditcard.cardholderName, number=creditcard.number, expiration=creditcard.expiration, csv=creditcard.csv, folderID=creditcard.folderID)
    db.add(db_creditcard)
    db.commit()
    db.refresh(db_creditcard)
    return db_creditcard


# Read (GET)

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.userID == user_id).first()


# Needs POSTMAN test and implementation (need to have meeting about API endpoints for GET vs. POST)
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# Needs POSTMAN test and implementation (need to have meeting about API endpoints for GET vs. POST)
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def get_password(db: Session, password_id: str):
    return db.query(models.Passwords).filter(models.Passwords.passwordID == password_id).first()


def get_note(db: Session, note_id: str):
    return db.query(models.Note).filter(models.Note.noteID == note_id).first()


def get_creditcard(db: Session, creditcard_id: str):
    return db.query(models.CreditCard).filter(models.CreditCard.creditcardID == creditcard_id).first()


def get_folder(db: Session, folder_id: int):
    return db.query(models.Folder).filter(models.Folder.folderID == folder_id).first()

# Update (PATCH/PUT)


# Delete (DELETE)