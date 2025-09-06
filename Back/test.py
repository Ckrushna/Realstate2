from fastapi import FastAPI, HTTPException, Depends, File, status, UploadFile
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid
from fastapi.staticfiles import StaticFiles
from fastapi import Form
from typing import Annotated
# Initialize FastAPI app
app = FastAPI()

# CORS Middleware
origins = ['http://localhost:5173']  # Update for your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Ensure models are created
models.Base.metadata.create_all(bind=engine)


ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif"}
UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ProjectBase(BaseModel):
    name: str
    wing: int
    floor: int
    image: str

    class Config:
        orm_mode = True

class ProjectModel(ProjectBase):
    id: int

class RegisterBase(BaseModel):
    username: str
    password: str
    email: str
    address: str
    age: int
    city: str
    state: str
    postalcode: str

    class Config:
        orm_mode = True

class RegisterModel(RegisterBase):
    id: int
    username: str
    password: str

class UserBase(BaseModel):
    username: str
    password: str

    class Config:
        orm_mode = True

class UserModel(UserBase):
    id: int
    username: str
    password: str

@app.post("/login", response_model=UserModel)
async def login_user(user: UserBase, db: Session = Depends(get_db)):
    # Log input username for debugging
    print(f"Attempting login for username: {user.username}")

    # Query the `registers` table for the username
    db_user = db.query(models.Register).filter(models.Register.username == user.username).first()

    # Check if the user exists in the `registers` table
    if not db_user:
        print("No user found with this username.")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Validate the password
    if db_user.password != user.password:
        print("Invalid password entered.")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # If both username and password are valid, return the user details
    print("Login successful!")
    return db_user



@app.post("/registers", response_model=RegisterModel)
async def register_user(user: RegisterBase, db: Session = Depends(get_db)):
    # Check if the username is already taken
    if db.query(models.Register).filter(models.Register.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create a new user entry
    new_user = models.Register(
        username=user.username,
        password=user.password,
        email=user.email,
        address=user.address,
        age=user.age,
        city=user.city,
        state=user.state,
        postalcode=user.postalcode
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.get("/login/{username}", response_model=RegisterModel)
async def read_logged_in_user(username: str, db: Session = Depends(get_db)):
    user = db.query(models.Register).filter(models.Register.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/registers", response_model=List[RegisterModel])
async def get_registered_users(db: Session = Depends(get_db)):
    # Retrieve all registered users
    users = db.query(models.Register).all()
    return users

# Static files for image hosting
app.mount("/uploaded_images", StaticFiles(directory=UPLOAD_DIR), name="uploaded_images")


@app.post("/projects", response_model=ProjectModel)
async def create_project(
    name: str = Form(...),
    wing: int = Form(...),
    floor: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    ALLOWED_EXTENSIONS = {".jpeg", ".jpg", ".png", ".pdf"}  # Allowed file types
    UPLOAD_DIR = "uploads"  # Define the upload directory

    # Validate the file extension
    file_extension = os.path.splitext(image.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # Generate a unique filename
    unique_filename = f"{uuid.uuid4().hex}{file_extension}"
    file_location = os.path.join(UPLOAD_DIR, unique_filename).replace("\\", "/")

    # Save the uploaded file to the server
    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure the upload directory exists
        with open(file_location, "wb") as file:
            file.write(await image.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save the file")

    # Create a new project entry in the database
    new_project = models.Project(
        name=name,
        wing=wing,
        floor=floor,
        image=file_location
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


@app.get("/projects", status_code=status.HTTP_200_OK)
async def read_projects(pname: str, db: Session = Depends(get_db)):
    projects = db.query(models.Project).filter(models.Project.name == pname).first() 
    if projects is None:
          raise HTTPException(status_code=404, detail='User not found')
    return projects

@app.delete("/projects{name}", response_model=ProjectModel)
async def delet_project(name: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.name == name).first()
    if not project:
        raise HTTPException(status_code=404, detail="User not found")
    if not project:
      raise HTTPException(status_code=404, detail="User not found")

    db.delete(project)
    db.commit()

    return project
  