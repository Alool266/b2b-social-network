# Made written by ali hasan
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import get_db, Company, User
from app.schemas import CompanyCreate, CompanyResponse, CompanyUpdate
from app.services.auth import get_password_hash, create_access_token, authenticate_user, ACCESS_TOKEN_EXPIRE_MINUTES
from pydantic import BaseModel
from datetime import timedelta
from typing import Optional

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(CompanyCreate):
    email: str
    password: str
    user_name: str

@router.post("/register", response_model=dict)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if company already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create company
    company = Company(
        name=request.name,
        industry=request.industry,
        description=request.description,
        website=request.website,
        location=request.location,
        size=request.size,
        logo_url=request.logo_url
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    
    # Create user
    user = User(
        company_id=company.id,
        email=request.email,
        password_hash=get_password_hash(request.password),
        name=request.user_name,
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {"message": "Registration successful", "company_id": company.id}

@router.post("/login", response_model=dict)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(
        data={"sub": user.email, "company_id": user.company_id, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer", "company_id": user.company_id, "role": user.role}

@router.get("/me", response_model=CompanyResponse)
def get_current_company(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
