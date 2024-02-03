from sqlalchemy.orm import Session

import crud
import schemas
import models
from fastapi import Depends, FastAPI, HTTPException
from database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware

# models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # You might want to restrict this to a specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CRUD: passwords, notes, credit cards
# RUD: users, folders

# Create rows

@app.post("/users")
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400,
                            detail="Email already registered")
    new_user = crud.create_user(db=db, user=user)
    crud.create_folder(db=db, folder=schemas.Folder(
        folderName="Default", userID=new_user.userID))
    return new_user


@app.post("/folders")
def create_folder(folder: schemas.Folder, db: Session = Depends(get_db)):
    folder = crud.create_folder(db=db, folder=folder)
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder


@app.post("/passwords")
def create_password(password: schemas.Password, db: Session = Depends(get_db)):
    password = crud.create_password(db=db, password=password)
    if password is None:
        raise HTTPException(status_code=404, detail="Password not found")
    return password


@app.post("/notes")
def create_note(note: schemas.Note, db: Session = Depends(get_db)):
    notes = crud.create_note(db=db, note=note)
    if notes is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return notes


@app.post("/creditcards")
def create_creditcard(creditcard: schemas.CreditCard,
                      db: Session = Depends(get_db)):
    creditcard = crud.create_creditcard(db=db, creditcard=creditcard)
    if creditcard is None:
        raise HTTPException(status_code=404, detail="Credit card not found")
    return creditcard


# Read rows (get single row)
@app.get("/users")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users/{email}")
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=email)
    return user


@app.get("/passwords")
def get_password(password_id: int, db: Session = Depends(get_db)):
    password = crud.get_password(db, password_id=password_id)
    if password is None:
        raise HTTPException(status_code=404, detail="Password not found")
    return password


@app.get("/passwords/{folder_id}")
def get_passwords_by_user(folder_id: int, db: Session = Depends(get_db)):
    passwords = crud.get_passwords_by_folder_id(db, folder_id=folder_id)
    return passwords


@app.get("/notes")
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = crud.get_note(db, note_id=note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.get("/creditcards")
def get_creditcard(creditcard_id: int, db: Session = Depends(get_db)):
    creditcard = crud.get_creditcard(db, creditcard_id=creditcard_id)
    if creditcard is None:
        raise HTTPException(status_code=404, detail="Credit card not found")
    return creditcard


@app.get("/folders")
def get_folder(folder_id: int, db: Session = Depends(get_db)):
    folder = crud.get_folder(db, folder_id=folder_id)
    if folder is None:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder


@app.get("/folders/{user_id}")
def get_folders_by_user(user_id: int, db: Session = Depends(get_db)):
    folders = crud.get_folders_by_user_id(db, user_id=user_id)
    return folders

# Update rows


# Delete rows


# @app.get("/users/", response_model=list[schemas.User])
# def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(
# get_db)):
#     users = crud.get_users(db, skip=skip, limit=limit)
#     return users
#
#
# @app.get("/users/{user_id}", response_model=schemas.User)
# def read_user(user_id: int, db: Session = Depends(get_db)):
#     db_user = crud.get_user(db, user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user
