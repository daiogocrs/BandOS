from sqlalchemy.orm import Session
from app.models import Show
from app.schemas.show import ShowCreate

def criar_show(db: Session, show: ShowCreate, banda_id: int):
    db_show = Show(
        data_hora=show.data_hora,
        local=show.local,
        descricao=show.descricao,
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