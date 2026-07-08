from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.api.deps import obter_usuario_atual
from app.schemas.equipamento import EquipamentoCreate, EquipamentoResponse
from app.services import equipamento as equipamento_service
from app.models import Usuario

router = APIRouter()

@router.post("/{banda_id}", response_model=EquipamentoResponse, status_code=status.HTTP_201_CREATED)
def criar_equipamento(
    banda_id: int, 
    equipamento: EquipamentoCreate, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """
    Adiciona um novo equipamento ao inventário da banda.
    Protegido: Apenas utilizadores autenticados.
    """
    return equipamento_service.criar_equipamento(db=db, equipamento=equipamento, banda_id=banda_id)

@router.get("/{banda_id}", response_model=List[EquipamentoResponse])
def listar_equipamentos(
    banda_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """
    Lista todos os equipamentos de uma banda específica.
    Protegido: Apenas utilizadores autenticados.
    """
    return equipamento_service.listar_equipamentos_por_banda(db=db, banda_id=banda_id, skip=skip, limit=limit)