from sqlalchemy.orm import Session
from app.models import Show
from app.schemas.show import ShowCreate
from fastapi import HTTPException, status
from datetime import datetime, timezone

def criar_show(db: Session, show_in: ShowCreate, banda_id: int):
    if show_in.data_hora.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Não é possível agendar um show no passado."
        )
    db_show = Show(
        data_hora=show_in.data_hora,
        local=show_in.local,
        descricao=show_in.descricao,
        banda_id=banda_id
    )
    
    db.add(db_show)
    db.commit()
    db.refresh(db_show)
    return db_show

def listar_shows_por_banda(db: Session, banda_id: int, skip: int = 0, limit: int = 100):
    return db.query(Show).filter(Show.banda_id == banda_id).order_by(Show.data_hora).offset(skip).limit(limit).all()

def obter_show(db: Session, show_id: int):
    return db.query(Show).filter(Show.id == show_id).first()