from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import Usuario
from app.api.deps import obter_usuario_atual
from app.api.musicas import verificar_permissao_banda
from app.schemas.ensaio import EnsaioCreate, EnsaioResponse
from app.services import ensaio as ensaio_service

router = APIRouter()

@router.post("/bandas/{banda_id}/ensaios", response_model=EnsaioResponse, status_code=status.HTTP_201_CREATED)
def agendar_ensaio(
    banda_id: int,
    ensaio_in: EnsaioCreate,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    verificar_permissao_banda(db, banda_id, usuario_atual.id)
    return ensaio_service.criar_ensaio(db=db, ensaio_in=ensaio_in, banda_id=banda_id)

@router.get("/bandas/{banda_id}/ensaios", response_model=List[EnsaioResponse])
def listar_ensaios(
    banda_id: int,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    verificar_permissao_banda(db, banda_id, usuario_atual.id)
    return ensaio_service.listar_ensaios_da_banda(db=db, banda_id=banda_id)