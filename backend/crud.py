from sqlalchemy.orm import Session

import models
import schemas


# Create (POST)

def create_user(db: Session, user: schemas.User):
    db_user = models.User(email=user.email,
                          hashedMasterKey=user.hashedMasterKey)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_folder(db: Session, folder: schemas.Folder):
    db_folder = models.Folder(folderName=folder.folderName,
                              userID=folder.userID)
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder


def create_password(db: Session, password: schemas.Password):
    db_password = models.Passwords(websiteName=password.websiteName,
                                   username=password.username,
                                   encryptedPassword=password.encryptedPassword,
                                   folderID=password.folderID)
    db.add(db_password)
    db.commit()
    db.refresh(db_password)
    return db_password


def create_note(db: Session, note: schemas.Note):
    db_note = models.Note(noteName=note.noteName, content=note.content,
                          folderID=note.folderID)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


def create_creditcard(db: Session, creditcard: schemas.CreditCard):
    db_creditcard = models.CreditCard(cardName=creditcard.cardName,
                                      cardholderName=creditcard.cardholderName,
                                      number=creditcard.number,
                                      expiration=creditcard.expiration,
                                      csv=creditcard.csv,
                                      folderID=creditcard.folderID)
    db.add(db_creditcard)
    db.commit()
    db.refresh(db_creditcard)
    return db_creditcard


# Read (GET)

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.userID == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def get_password(db: Session, password_id: str):
    return db.query(models.Passwords).filter(
        models.Passwords.passwordID == password_id).first()


def get_passwords_by_folder_id(db: Session, folder_id: int):
    return db.query(models.Passwords).filter(
        models.Passwords.folderID == folder_id).all()


def get_note(db: Session, note_id: str):
    return db.query(models.Note).filter(models.Note.noteID == note_id).first()


def get_creditcard(db: Session, creditcard_id: str):
    return db.query(models.CreditCard).filter(
        models.CreditCard.creditcardID == creditcard_id).first()


def get_folder(db: Session, folder_id: int):
    return db.query(models.Folder).filter(
        models.Folder.folderID == folder_id).first()


def get_folders_by_user_id(db: Session, user_id: int):
    return db.query(models.Folder).filter(models.Folder.userID == user_id).all()


# Update (PATCH/PUT)

def update_user(db: Session, user_id: int, user: schemas.User):
    db_user = db.query(models.User).filter(models.User.userID == user_id).first()
    if db_user is None:
        return None
    if user.email is not None:
        db_user.email = user.email
    if user.hashedMasterKey is not None:
        db_user.hashedMasterKey = user.hashedMasterKey
    db.commit()
    db.refresh(db_user)
    return db_user


def update_folder(db: Session, folder_id: int, folder: schemas.Folder):
    db_folder = db.query(models.Folder).filter(models.Folder.folderID == folder_id).first()
    if db_folder is None:
        return None
    db_folder.folderName = folder.folderName if folder.folderName is not None else db_folder.folderName
    db_folder.userID = folder.userID if folder.userID is not None else db_folder.userID
    db.commit()
    db.refresh(db_folder)
    return db_folder


def update_password(db: Session, password_id: int, password: schemas.Password):
    db_password = db.query(models.Passwords).filter(models.Passwords.passwordID == password_id).first()
    if db_password is None:
        return None
    db_password.websiteName = password.websiteName
    db_password.username = password.username
    db_password.encryptedPassword = password.encryptedPassword
    db_password.folderID = password.folderID
    db.commit()
    db.refresh(db_password)
    return db_password

def update_note(db: Session, note_id: int, note: schemas.Note):
    db_note = db.query(models.Note).filter(models.Note.noteID == note_id).first()
    if db_note is None:
        return None
    db_note.noteName = note.noteName
    db_note.content = note.content
    db_note.folderID = note.folderID
    db.commit()
    db.refresh(db_note)
    return db_note

def update_creditcard(db: Session, creditcard_id: int, creditcard: schemas.CreditCard):
    db_creditcard = db.query(models.CreditCard).filter(models.CreditCard.creditcardID == creditcard_id).first()
    if db_creditcard is None:
        return None
    db_creditcard.cardName = creditcard.cardName if creditcard.cardName is not None else db_creditcard.cardName
    db_creditcard.cardholderName = creditcard.cardholderName if creditcard.cardholderName is not None else db_creditcard.cardholderName
    db_creditcard.number = creditcard.number if creditcard.number is not None else db_creditcard.number
    db_creditcard.expiration = creditcard.expiration if creditcard.expiration is not None else db_creditcard.expiration
    db_creditcard.csv = creditcard.csv if creditcard.csv is not None else db_creditcard.csv
    db_creditcard.folderID = creditcard.folderID if creditcard.folderID is not None else db_creditcard.folderID
    db.commit()
    db.refresh(db_creditcard)
    return db_creditcard

# Delete (DELETE)
# Functions below are untested -- need Schema update for cascading delete
def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.userID == user_id).first()
    if user is None:
        return None
    db.delete(user)
    db.commit()
    return user


def delete_folder(db: Session, folder_id: int):
    folder = db.query(models.Folder).filter(models.Folder.folderID == folder_id).first()
    if folder is None:
        return None
    db.delete(folder)
    db.commit()
    return folder


def delete_password(db: Session, password_id: int):
    password = db.query(models.Passwords).filter(models.Passwords.passwordID == password_id).first()
    if password is None:
        return None
    db.delete(password)
    db.commit()
    return password


def delete_note(db: Session, note_id: int):
    note = db.query(models.Note).filter(models.Note.noteID == note_id).first()
    if note is None:
        return None
    db.delete(note)
    db.commit()
    return note


def delete_creditcard(db: Session, creditcard_id: int):
    creditcard = db.query(models.CreditCard).filter(models.CreditCard.creditcardID == creditcard_id).first()
    if creditcard is None:
        return None
    db.delete(creditcard)
    db.commit()
    return creditcard
