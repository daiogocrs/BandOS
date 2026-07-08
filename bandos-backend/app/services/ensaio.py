from sqlalchemy.orm import Session
from app.models import Ensaio
from app.schemas.ensaio import EnsaioCreate

def criar_ensaio(db: Session, ensaio_in: EnsaioCreate, banda_id: int):
    novo_ensaio = Ensaio(**ensaio_in.model_dump(), banda_id=banda_id)
    db.add(novo_ensaio)
    db.commit()
    db.refresh(novo_ensaio)
    return novo_ensaio

def listar_ensaios_da_banda(db: Session, banda_id: int):
    return db.query(Ensaio).filter(Ensaio.banda_id == banda_id).all()