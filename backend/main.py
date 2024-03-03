from sqlalchemy.orm import Session

import crud
import mfa
import schemas
import models
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from mfa import create_qrcode_url
from access_token import verify_token, create_access_token

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

# Create rows

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
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    folder = crud.create_folder(db=db, folder=folder)
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder


@app.post("/passwords")
def create_password(
        password: schemas.Password,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    password = crud.create_password(db=db, password=password)
    if password is None:
        raise HTTPException(status_code=404, detail="Password not found")
    return password


@app.post("/notes")
def create_note(
        note: schemas.Note,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    notes = crud.create_note(db=db, note=note)
    if notes is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return notes


@app.post("/creditcards")
def create_creditcard(
        creditcard: schemas.CreditCard,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    creditcard = crud.create_creditcard(db=db, creditcard=creditcard)
    if creditcard is None:
        raise HTTPException(status_code=404, detail="Credit card not found")
    return creditcard


@app.post("/mfa/{mfa_type}")
def verify_mfa(
        mfa_type: str,
        mfa_verify: schemas.MFAVerify,
        db: Session = Depends(get_db)):
    user: models.User = crud.get_user_by_email(db, email=mfa_verify.email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    secret_key = user.get_totpKey()
    mfa_code = mfa_verify.mfaCode
    verify_result = mfa.verify_mfa(secret_key, mfa_code)
    access_token = create_access_token(user_data=user)
    if mfa_type == "login":
        return access_token if verify_result else None
    else:
        return verify_result


# Read rows (get single row)
@app.get("/users")
def get_user(
        user_id: int,
        db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users/{email}")
def get_user_by_email(
        email: str,
        db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=email)
    return user


@app.get("/passwords")
def get_password(
        password_id: int, db:
        Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    password = crud.get_password(db, password_id=password_id)
    if password is None:
        raise HTTPException(status_code=404, detail="Password not found")
    return password


@app.get("/passwords/{folder_id}")
def get_passwords_by_user(
        folder_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    passwords = crud.get_passwords_by_folder_id(db, folder_id=folder_id)
    return passwords


@app.get("/notes")
def get_note(
        note_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    note = crud.get_note(db, note_id=note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.get('/notes/{folder_id}')
def get_notes_by_folder(
        folder_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    notes = crud.get_notes_by_folder_id(db, folder_id=folder_id)
    return notes


@app.get("/creditcards")
def get_creditcard(
        creditcard_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    creditcard = crud.get_creditcard(db, creditcard_id=creditcard_id)
    if creditcard is None:
        raise HTTPException(status_code=404, detail="Credit card not found")
    return creditcard


@app.get('/creditcards/{folder_id}')
def get_creditcards_by_folder(
        folder_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    creditcards = crud.get_creditcards_by_folder_id(db, folder_id=folder_id)
    return creditcards


@app.get("/folders")
def get_folder(
        folder_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    folder = crud.get_folder(db, folder_id=folder_id)
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder


@app.get("/folders/{user_id}")
def get_folders_by_user(
        user_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    folders = crud.get_folders_by_user_id(db, user_id=user_id)
    return folders


# UPDATE rows

# update the name of the folder
@app.put("/folders/{folder_id}")
def update_folder(
        folder_id: int,
        folder: schemas.Folder,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    folder = crud.update_folder(db, folder_id, folder)
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder


# update user master password (expecting hashed password from UI)
@app.put("/users/{user_id}")
def update_user(
        user_id: int,
        user: schemas.User,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    updated_user = crud.update_user(db, user_id=user_id, user=user)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@app.put("/folders/{folder_id}")
def update_folder(
        folder_id: int,
        folder: schemas.Folder,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    updated_folder = crud.update_folder(db, folder_id == folder_id,
                                        folder=folder)
    if updated_folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return updated_folder


# update the password of the saved entry
@app.put("/passwords/{password_id}")
def update_password(
        password_id: int,
        password: schemas.Password,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    updated_password = crud.update_password(db, password_id=password_id,
                                            password=password)
    if updated_password is None:
        raise HTTPException(status_code=404, detail="Password not found")
    return updated_password


@app.put("/notes/{note_id}")
def update_note(
        note_id: int,
        note: schemas.Note,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    updated_note = crud.update_note(db, note_id=note_id, note=note)
    if updated_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated_note


@app.put("/creditcards/{creditcard_id}")
def update_creditcard(
        creditcard_id: int,
        creditcard: schemas.CreditCard,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    updated_creditcard = crud.update_creditcard(db, creditcard_id=creditcard_id,
                                                creditcard=creditcard)
    if updated_creditcard is None:
        raise HTTPException(status_code=404, detail="Credit card not found")
    return updated_creditcard


# DELETE rows

@app.delete("/users/{user_id}")
def delete_user(
        user_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    user = crud.delete_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.delete("/passwords/{password_id}")
def delete_password(
        password_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    password = crud.delete_password(db, password_id)
    if password is None:
        raise HTTPException(status_code=404, detail="Password not found")
    return password


@app.delete("/notes/{note_id}")
def delete_note(
        note_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    note = crud.delete_note(db, note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.delete("/creditcards/{creditcard_id}")
def delete_creditcard(
        creditcard_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    creditcard = crud.delete_creditcard(db, creditcard_id)
    if creditcard is None:
        raise HTTPException(status_code=404, detail="Credit card not found")
    return creditcard


@app.delete("/folders/{folder_id}")
def delete_folder(
        folder_id: int,
        db: Session = Depends(get_db),
        verified_token=Depends(verify_token)):
    if not verified_token:
        return HTTPException(
            status_code=401,
            detail="Token not valid")
    folder = crud.delete_folder(db, folder_id)
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder
