from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import Usuario, Banda, Integrante
from app.api.deps import obter_usuario_atual
from app.schemas.banda import BandaCreate, BandaResponse, IntegranteCreate, IntegranteResponse
from app.services import banda as banda_service
from typing import List

router = APIRouter()

@router.post("/", response_model=BandaResponse, status_code=status.HTTP_201_CREATED)
def criar_nova_banda(
    banda_in: BandaCreate, 
    db: Session = Depends(get_db), 
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    return banda_service.criar_banda(db=db, banda_in=banda_in, usuario_criador=usuario_atual)

@router.post("/{banda_id}/integrantes", response_model=IntegranteResponse, status_code=status.HTTP_201_CREATED)
def vincular_integrante(
    banda_id: int,
    integrante_in: IntegranteCreate,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    
    banda = db.query(Banda).filter(Banda.id == banda_id).first()
    if not banda:
        raise HTTPException(status_code=404, detail="Banda não encontrada")
        
    e_membro = db.query(Integrante).filter(
        Integrante.banda_id == banda_id,
        Integrante.usuario_id == usuario_atual.id
    ).first()
    
    if not e_membro:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Acesso negado. Apenas membros desta banda podem adicionar integrantes."
        )

    ja_existe = db.query(Integrante).filter(
        Integrante.banda_id == banda_id,
        Integrante.usuario_id == integrante_in.usuario_id
    ).first()
    if ja_existe:
        raise HTTPException(status_code=400, detail="Este utilizador já integra a banda.")

    return banda_service.adicionar_integrante(db=db, banda_id=banda_id, integrante_in=integrante_in)

@router.get("/", response_model=List[BandaResponse])
def listar_bandas(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """Lista todas as bandas."""
    bandas = banda_service.listar_bandas(db=db, skip=skip, limit=limit)
    return bandas