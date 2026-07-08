from sqlalchemy.orm import Session
from app.models import Musica
from app.schemas.musica import MusicaCreate

def criar_musica(db: Session, musica_in: MusicaCreate, banda_id: int):
    nova_musica = Musica(**musica_in.model_dump(), banda_id=banda_id)
    
    db.add(nova_musica)
    db.commit()
    db.refresh(nova_musica)
    
    return nova_musica

def listar_musicas_da_banda(db: Session, banda_id: int):
    return db.query(Musica).filter(Musica.banda_id == banda_id).all()