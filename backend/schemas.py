from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


# ── Auth ──────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ── Profile ───────────────────────────────────────────
class ProfileCreate(BaseModel):
    full_name: str
    age: int
    occupation: str
    annual_income: float
    monthly_savings: float


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    annual_income: Optional[float] = None
    monthly_savings: Optional[float] = None


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    age: int
    occupation: str
    annual_income: float
    monthly_savings: float

    class Config:
        from_attributes = True


# ── Goals ─────────────────────────────────────────────
class GoalCreate(BaseModel):
    goal_name: str
    goal_type: str
    target_amount: float
    target_date: date


class GoalUpdate(BaseModel):
    goal_name: Optional[str] = None
    goal_type: Optional[str] = None
    target_amount: Optional[float] = None
    target_date: Optional[date] = None


class GoalResponse(BaseModel):
    id: int
    user_id: int
    goal_name: str
    goal_type: str
    target_amount: float
    target_date: date
    created_at: datetime

    class Config:
        from_attributes = True


# ── Portfolio ─────────────────────────────────────────
class PortfolioCreate(BaseModel):
    fund_name: str
    asset_type: str
    investment_amount: float
    current_value: float


class PortfolioUpdate(BaseModel):
    fund_name: Optional[str] = None
    asset_type: Optional[str] = None
    investment_amount: Optional[float] = None
    current_value: Optional[float] = None


class PortfolioResponse(BaseModel):
    id: int
    user_id: int
    fund_name: str
    asset_type: str
    investment_amount: float
    current_value: float
    created_at: datetime

    class Config:
        from_attributes = True
