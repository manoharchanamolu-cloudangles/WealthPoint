from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


@router.post("/", response_model=schemas.PortfolioResponse, status_code=status.HTTP_201_CREATED)
def add_investment(
    item_data: schemas.PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    item = models.Portfolio(user_id=current_user.id, **item_data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/", response_model=List[schemas.PortfolioResponse])
def get_investments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).all()


@router.put("/{item_id}", response_model=schemas.PortfolioResponse)
def update_investment(
    item_id: int,
    item_data: schemas.PortfolioUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    item = db.query(models.Portfolio).filter(
        models.Portfolio.id == item_id,
        models.Portfolio.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Investment not found")
    for key, value in item_data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_investment(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    item = db.query(models.Portfolio).filter(
        models.Portfolio.id == item_id,
        models.Portfolio.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Investment not found")
    db.delete(item)
    db.commit()
