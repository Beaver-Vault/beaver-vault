from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Need temporary middleware to allow local IP addres access, otherwise we get an immediate crash on the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This will return an actual password object later, but returning just a string now
@app.get("/password")
def index():
    return {"Entry": "To Save/Get to/from Database"}