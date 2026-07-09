from sqlalchemy.orm import Session
from app.models import Ensaio
from app.schemas.ensaio import EnsaioCreate
from fastapi import HTTPException, status
from datetime import datetime, timezone

def criar_ensaio(db: Session, ensaio_in: EnsaioCreate, banda_id: int):
    if ensaio_in.data_hora.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível marcar um ensaio no passado."
        )
    
    novo_ensaio = Ensaio(**ensaio_in.model_dump(), banda_id=banda_id)
    db.add(novo_ensaio)
    db.commit()
    db.refresh(novo_ensaio)
    return novo_ensaio

def listar_ensaios_da_banda(db: Session, banda_id: int):
    return db.query(Ensaio).filter(Ensaio.banda_id == banda_id).all()