from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Register(Base):
    __tablename__ = 'registers'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    address = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    postalcode = Column(String(10), nullable=False)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(50), nullable=False)

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(100), nullable=False)
    image = Column(String(500), nullable=False)
    wing = Column(Integer, nullable=False)
    floor = Column(Integer, nullable=False)
    series = Column(Integer, nullable=False)