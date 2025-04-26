from sqlalchemy.orm import Session
from uuid import UUID

import crud
import mfa
import schemas
import models
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from mfa import create_qrcode_url
from exception_handler import validate_token, is_item_found
from access_token import (verify_token, verify_refresh_token,
                          create_access_token,
                          create_refresh_token)

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Access-Control-Allow-Origin"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# FOR TESTING ONLY
@app.get("/access-token/{userEmail}")
def get_access_token(userEmail: str, db: Session = Depends(get_db)):
    return create_access_token(crud.get_user_by_email(db, userEmail))


@app.post("/refresh-token/")
def get_refresh_token(refreshRequest: schemas.RefreshRequest,
                      db: Session = Depends(get_db)):
    if verify_refresh_token(refreshRequest):
        return create_access_token(crud.get_user_by_email(
            db, refreshRequest.email))
    else:
        return HTTPException(status_code=401, detail="Refresh Token not valid")


@app.post("/users")
def create_user(
        user: schemas.User,
        db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400,
                            detail="Email already registered")
    new_user = crud.create_user(db=db, user=user)
    crud.create_folder(db=db, folder=schemas.Folder(
        folderName="Default", userID=new_user.userID))
    qr_code_url = create_qrcode_url(new_user.totpKey, new_user.email)
    return {"user": new_user, "qr_code_url": qr_code_url}


@app.post("/folders")
def create_folder(
        folder: schemas.Folder,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    folder = crud.create_folder(db=db, folder=folder)
    is_item_found(folder, "Folder")
    return folder


@app.post("/passwords")
def create_password(
        password: schemas.Password,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    password = crud.create_password(db=db, password=password)
    is_item_found(password, "Password")
    return password


@app.post("/notes")
def create_note(
        note: schemas.Note,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    notes = crud.create_note(db=db, note=note)
    is_item_found(notes, "Note")
    return notes


@app.post("/creditcards")
def create_creditcard(
        creditcard: schemas.CreditCard,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    creditcard = crud.create_creditcard(db=db, creditcard=creditcard)
    is_item_found(creditcard, "Credit Card")
    return creditcard


@app.post("/mfa/{mfa_type}")
def verify_mfa(
        mfa_type: str,
        mfa_verify: schemas.MFAVerify,
        db: Session = Depends(get_db)):
    user: models.User = crud.get_user_by_email(db, email=mfa_verify.email)
    is_item_found(user, "User")
    secret_key = user.get_totpKey()
    mfa_code = mfa_verify.mfaCode
    verify_result = mfa.verify_mfa(secret_key, mfa_code)
    print(verify_result)
    access_token = create_access_token(user_data=user)
    refresh_token = create_refresh_token(user_data=user)
    if mfa_type == "login":
        if verify_result:
            return {"access_token": access_token,
                    "refresh_token": refresh_token}
        else:
            return None
    else:
        return {"access_token": access_token,
                "refresh_token": refresh_token} 


# Read rows (get single row)
@app.get("/users")
def get_user(
        user_id: UUID,
        db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id=user_id)
    is_item_found(user, "User")
    return user


@app.get("/users/{email}")
def get_user_by_email(
        email: str,
        db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=email)
    return user


@app.get("/passwords")
def get_password(
        password_id: UUID, db:
        Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    password = crud.get_password(db, password_id=password_id)
    is_item_found(password, "Password")
    return password


@app.get("/passwords/{folder_ids}")
def get_passwords_by_folder_ids(
        folder_ids: str,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    all_folder_ids = folder_ids.split(',')
    validate_token(verified_token)
    output = []
    for folder_id in all_folder_ids:
        passwords = crud.get_passwords_by_folder_id(db, folder_id=folder_id)
        output.extend(passwords)
    return output


@app.get("/notes")
def get_note(
        note_id: UUID,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    note = crud.get_note(db, note_id=note_id)
    is_item_found(note, "Note")
    return note


@app.get('/notes/{folder_ids}')
def get_notes_by_folder(
        folder_ids: str,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    all_folder_ids = folder_ids.split(',')
    validate_token(verified_token)
    output = []
    for folder_id in all_folder_ids:
        notes = crud.get_notes_by_folder_id(db, folder_id=folder_id)
        output.extend(notes)
    return output


@app.get("/creditcards")
def get_creditcard(
        creditcard_id: UUID,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    creditcard = crud.get_creditcard(db, creditcard_id=creditcard_id)
    is_item_found(creditcard, "Credit Card")
    return creditcard


@app.get('/creditcards/{folder_ids}')
def get_creditcards_by_folder(
        folder_ids: str,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    all_folder_ids = folder_ids.split(',')
    validate_token(verified_token)
    output = []
    for folder_id in all_folder_ids:
        creditcards = crud.get_creditcards_by_folder_id(db, folder_id=folder_id)
        output.extend(creditcards)
    return output


@app.get("/folders")
def get_folder(
        folder_id: UUID,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    folder = crud.get_folder(db, folder_id=folder_id)
    is_item_found(folder, "Folder")
    return folder


@app.get("/folders/{user_id}")
def get_folders_by_user(
        user_id: UUID,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    folders = crud.get_folders_by_user_id(db, user_id=user_id)
    return folders


# UPDATE rows

# update the name of the folder
@app.put("/folders/{folder_id}")
def update_folder(
        folder_id: UUID,
        folder: schemas.Folder,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    folder = crud.update_folder(db, folder_id, folder)
    is_item_found(folder, "Folder")
    return folder


# update user master password (expecting hashed password from UI)
@app.put("/users/{user_id}")
def update_user(
        user_id: UUID,
        user: schemas.User,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    updated_user = crud.update_user(db, user_id=user_id, user=user)
    is_item_found(updated_user, "User")
    return updated_user


@app.put("/folders/{folder_id}")
def update_folder(
        folder_id: UUID,
        folder: schemas.Folder,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    updated_folder = crud.update_folder(db, folder_id == folder_id,
                                        folder=folder)
    is_item_found(updated_folder, "Folder")
    return updated_folder


# update the password of the saved entry
@app.put("/passwords/{password_id}")
def update_password(
        password_id: UUID,
        password: schemas.Password,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    updated_password = crud.update_password(db, password_id=password_id,
                                            password=password)
    is_item_found(updated_password, "Password")
    return updated_password


@app.put("/notes/{note_id}")
def update_note(
        note_id: UUID,
        note: schemas.Note,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    updated_note = crud.update_note(db, note_id=note_id, note=note)
    is_item_found(updated_note, "Note")
    return updated_note


@app.put("/creditcards/{creditcard_id}")
def update_creditcard(
        creditcard_id: UUID,
        creditcard: schemas.CreditCard,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    updated_creditcard = crud.update_creditcard(db, creditcard_id=creditcard_id,
                                                creditcard=creditcard)
    is_item_found(updated_creditcard, "Credit Card")
    return updated_creditcard


# PATCH

@app.patch("/passwords/{password_id}")
def patch_trashbin_password(
    password_id: UUID,
    restore: schemas.TrashBin,  
    db: Session = Depends(get_db),
    verified_token=Depends(verify_token)
):
    print(restore)
    validate_token(verified_token)
    updated_password = crud.patch_trashbin_password(db, password_id=password_id, restore=restore.restore)
    is_item_found(updated_password, "Password")
    return updated_password

@app.patch("/notes/{note_id}")
def patch_trashbin_note(
    note_id: UUID,
    restore: schemas.TrashBin,   
    db: Session = Depends(get_db),
    verified_token=Depends(verify_token)
):
    print(restore)
    validate_token(verified_token)
    updated_note = crud.patch_trashbin_note(db, note_id=note_id, restore=restore.restore)
    is_item_found(updated_note, "Note")
    return updated_note

@app.patch("/creditcards/{creditcard_id}")
def patch_trashbin_creditcard(
    creditcard_id: UUID,
    restore: schemas.TrashBin,  
    db: Session = Depends(get_db),
    verified_token=Depends(verify_token)
):
    print(restore)
    validate_token(verified_token)
    updated_creditcard = crud.patch_trashbin_creditcard(db, creditcard_id=creditcard_id, restore=restore.restore)
    is_item_found(updated_creditcard, "Credit Card")
    return updated_creditcard


# DELETE rows

@app.delete("/users/{user_id}")
def delete_user(
        user_id: UUID,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    user = crud.delete_user(db, user_id)
    is_item_found(user, "User")
    return user


@app.delete("/passwords/{password_id}")
def delete_password(
        password_id: UUID,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    password = crud.delete_password(db, password_id)
    is_item_found(password, "Password")
    return password


@app.delete("/notes/{note_id}")
def delete_note(
        note_id: UUID,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    note = crud.delete_note(db, note_id)
    is_item_found(note, "Note")
    return note


@app.delete("/creditcards/{creditcard_id}")
def delete_creditcard(
        creditcard_id: UUID,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    creditcard = crud.delete_creditcard(db, creditcard_id)
    is_item_found(creditcard, "Credit Card")
    return creditcard


@app.delete("/folders/{folder_id}")
def delete_folder(
        folder_id: UUID,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    validate_token(verified_token)
    folder = crud.delete_folder(db, folder_id)
    is_item_found(folder, "Folder")
    return folder
