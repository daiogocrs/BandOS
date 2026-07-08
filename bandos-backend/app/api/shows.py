from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.api.deps import obter_usuario_atual
from app.schemas.show import ShowCreate, ShowResponse
from app.services import show as show_service
from app.models import Usuario

router = APIRouter()

@router.post("/{banda_id}", response_model=ShowResponse, status_code=status.HTTP_201_CREATED)
def criar_show(
    banda_id: int, 
    show: ShowCreate, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """
    Cria um novo show para uma banda específica.
    Protegido: Apenas utilizadores autenticados.
    """
    return show_service.criar_show(db=db, show=show, banda_id=banda_id)

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