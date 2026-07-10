from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import Usuario, Banda, Integrante
from app.api.deps import obter_usuario_atual
from app.schemas.banda import BandaCreate, BandaResponse, IntegranteCreate, IntegranteResponse, BandaUpdate
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
def adicionar_integrante(
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
            detail="Acesso negado."
        )

    usuario_convidado = db.query(Usuario).filter(Usuario.email == integrante_in.email).first()
    if not usuario_convidado:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado.")

    ja_na_banda = db.query(Integrante).filter(
        Integrante.banda_id == banda_id,
        Integrante.usuario_id == usuario_convidado.id
    ).first()
    
    if ja_na_banda:
        raise HTTPException(status_code=400, detail="Este utilizador já faz parte da banda.")

    novo_integrante = Integrante(
        usuario_id=usuario_convidado.id,
        banda_id=banda_id,
        papel=integrante_in.papel,
        funcao=integrante_in.funcao
    )
    
    db.add(novo_integrante)
    db.commit()
    db.refresh(novo_integrante) 
    
    return {
        "id": novo_integrante.id,
        "usuario_id": novo_integrante.usuario_id,
        "nome_usuario": usuario_convidado.nome,
        "email_usuario": usuario_convidado.email,
        "papel": novo_integrante.papel,
        "funcao": novo_integrante.funcao
    }

@router.get("/", response_model=List[BandaResponse])
def listar_bandas(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """Lista todas as bandas."""
    bandas = banda_service.listar_bandas(db=db, usuario=usuario_atual, skip=skip, limit=limit)
    return bandas

@router.get("/{banda_id}/integrantes")
def listar_integrantes(
    banda_id: int,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    integrantes_db = db.query(Integrante).filter(Integrante.banda_id == banda_id).all()
    
    lista_resposta = []
    for intg in integrantes_db:
        lista_resposta.append({
            "id": intg.id,
            "usuario_id": intg.usuario_id,
            "nome_usuario": intg.usuario.nome,  
            "email_usuario": intg.usuario.email, 
            "papel": intg.papel,
            "funcao": intg.funcao
        })
        
    return lista_resposta

@router.put("/{banda_id}", response_model=BandaResponse)
def atualizar_dados_banda(
    banda_id: int,
    banda_in: BandaUpdate,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """Atualiza o nome ou descrição da banda."""
    
    banda_atualizada = banda_service.atualizar_banda(db=db, banda_id=banda_id, banda_in=banda_in)
    if not banda_atualizada:
        raise HTTPException(status_code=404, detail="Banda não encontrada")
        
    return banda_atualizada