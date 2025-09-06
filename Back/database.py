from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# MySQL database URL
URL_DATABASE = 'mysql+pymysql://root:Krushna123@localhost:3306/krushnacc'

# Create the engine to connect to MySQL (no need for check_same_thread)
engine = create_engine(URL_DATABASE)

# Create sessionmaker instance
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for declarative models
Base = declarative_base()