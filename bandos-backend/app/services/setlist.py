from sqlalchemy.orm import Session
from app.models.show_musica import ShowMusica
from app.schemas.setlist import SetlistAdd

def adicionar_musica_ao_show(db: Session, show_id: int, dados: SetlistAdd):
    """Adiciona uma música específica a um show."""
    novo_item = ShowMusica(
        show_id=show_id,
        musica_id=dados.musica_id,
        ordem=dados.ordem
    )
    db.add(novo_item)
    db.commit()
    db.refresh(novo_item)
    return novo_item

def listar_setlist(db: Session, show_id: int):
    """Retorna todas as músicas de um show, ordenadas pela coluna 'ordem'."""
    return db.query(ShowMusica).filter(ShowMusica.show_id == show_id).order_by(ShowMusica.ordem).all()

def remover_musica_do_show(db: Session, show_id: int, musica_id: int):
    """Remove uma música do alinhamento do show."""
    item = db.query(ShowMusica).filter(
        ShowMusica.show_id == show_id, 
        ShowMusica.musica_id == musica_id
    ).first()
    
    if item:
        db.delete(item)
        db.commit()
        return True
    return False