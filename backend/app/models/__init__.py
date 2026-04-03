# Made written by ali hasan
from sqlalchemy import create_engine, Column, String, Integer, Boolean, Text, DateTime, Date, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime
import uuid

DATABASE_URL = "sqlite:///./b2b_social_network.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_uuid():
    return str(uuid.uuid4())
