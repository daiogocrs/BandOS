from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Usuario, Integrante, Banda
from app.api.deps import obter_usuario_atual
from app.schemas.musica import MusicaCreate, MusicaResponse
from app.services import musica as musica_service

router = APIRouter()

def verificar_permissao_banda(db: Session, banda_id: int, usuario_id: int):
    membro = db.query(Integrante).filter(
        Integrante.banda_id == banda_id, 
        Integrante.usuario_id == usuario_id
    ).first()
    
    if not membro:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Acesso negado. Só membros podem aceder ao repertório desta banda."
        )
    return membro

@router.post("/bandas/{banda_id}/musicas", response_model=MusicaResponse, status_code=status.HTTP_201_CREATED)
def adicionar_musica_ao_repertorio(
    banda_id: int, 
    musica_in: MusicaCreate, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual) 
):
    verificar_permissao_banda(db, banda_id, usuario_atual.id)
    
    return musica_service.criar_musica(db=db, musica_in=musica_in, banda_id=banda_id)

@router.get("/bandas/{banda_id}/musicas", response_model=List[MusicaResponse])
def ver_repertorio(
    banda_id: int, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    verificar_permissao_banda(db, banda_id, usuario_atual.id)
    return musica_service.listar_musicas_da_banda(db=db, banda_id=banda_id)