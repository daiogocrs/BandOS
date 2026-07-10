from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioResponse, UsuarioUpdate, SenhaUpdate
from app.services import usuario as usuario_service
from app.models import Usuario
from app.api.deps import obter_usuario_atual

router = APIRouter()

@router.post("/", response_model=UsuarioResponse)
def criar_novo_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Email já cadastrado.")
    
    return usuario_service.criar_usuario(db=db, usuario=usuario)

@router.get("/me")
def ler_usuario_atual(usuario_atual: Usuario = Depends(obter_usuario_atual)):
    """Retorna os dados do utilizador atualmente logado."""
    return usuario_atual

@router.put("/me", response_model=UsuarioResponse)
def atualizar_dados_perfil(
    dados_in: UsuarioUpdate,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """Atualiza o nome do utilizador atual."""
    return usuario_service.atualizar_perfil(db=db, usuario=usuario_atual, nome=dados_in.nome)

@router.put("/me/senha")
def atualizar_senha_perfil(
    dados_in: SenhaUpdate,
    db: Session = Depends(get_db),
    usuario_atual: Usuario = Depends(obter_usuario_atual)
):
    """Altera a senha do utilizador atual se a senha antiga estiver correta."""
    sucesso = usuario_service.alterar_senha(
        db=db, 
        usuario=usuario_atual, 
        senha_atual=dados_in.senha_atual, 
        nova_senha=dados_in.nova_senha
    )
    if not sucesso:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="A senha atual está incorreta."
        )
    return {"mensagem": "Senha alterada com sucesso!"}