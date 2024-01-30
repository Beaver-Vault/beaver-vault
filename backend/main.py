from sqlalchemy.orm import Session

import crud
import schemas
import models
from fastapi import Depends, FastAPI, HTTPException
from database import SessionLocal

# models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users")
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    # db_user = crud.get_user_by_username(db, username=user.username)
    # if db_user:
    #     raise HTTPException(status_code=400,
    #                         detail="Username already registered")
    return crud.create_user(db=db, user=user)


@app.post("/folders")
def create_folder(folder: schemas.Folder, db: Session = Depends(get_db)):
    return crud.create_folder(db=db, folder=folder)


# @app.get("/users/", response_model=list[schemas.User])
# def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
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
