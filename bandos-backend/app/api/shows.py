from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.api.deps import obter_usuario_atual
from app.schemas.show import ShowCreate, ShowResponse
from app.services import show as show_service
from app.models import Usuario
from app.schemas.setlist import SetlistAdd, SetlistResponse
from app.services import setlist as setlist_service

router = APIRouter()

@router.post("/{banda_id}", response_model=ShowResponse, status_code=status.HTTP_201_CREATED)
def criar_show(
    banda_id: int, 
    show_in: ShowCreate, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """
    Cria um novo show para uma banda específica.
    Protegido: Apenas utilizadores autenticados.
    """
    return show_service.criar_show(db=db, show_in=show_in, banda_id=banda_id)

@router.get("/{banda_id}", response_model=List[ShowResponse])
def listar_shows(
    banda_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """
    Lista os shows de uma banda específica, ordenados por data.
    Protegido: Apenas utilizadores autenticados.
    """
    return show_service.listar_shows_por_banda(db=db, banda_id=banda_id, skip=skip, limit=limit)

@router.post("/{show_id}/setlist", response_model=SetlistResponse, status_code=status.HTTP_201_CREATED)
def adicionar_musica_setlist(
    show_id: int, 
    setlist_data: SetlistAdd, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """
    Adiciona uma música ao setlist de um show específico.
    Protegido: Apenas utilizadores autenticados.
    """
    return setlist_service.adicionar_musica_ao_show(db=db, show_id=show_id, dados=setlist_data)

@router.get("/{show_id}/setlist", response_model=List[SetlistResponse])
def listar_setlist_do_show(
    show_id: int, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """
    Lista todas as músicas do setlist de um show, respeitando a ordem.
    Protegido: Apenas utilizadores autenticados.
    """
    return setlist_service.listar_setlist(db=db, show_id=show_id)

@router.delete("/{show_id}/setlist/{musica_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_musica_setlist(
    show_id: int, 
    musica_id: int, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """
    Remove uma música específica do setlist de um show.
    Protegido: Apenas utilizadores autenticados.
    """
    sucesso = setlist_service.remover_musica_do_show(db=db, show_id=show_id, musica_id=musica_id)
    if not sucesso:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Música não encontrada no setlist deste show."
        )
    return None