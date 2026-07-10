from sqlalchemy.orm import Session
from app.models import Usuario
from app.schemas.usuario import UsuarioCreate
from app.core.security import get_password_hash, verify_password

def criar_usuario(db: Session, usuario: UsuarioCreate):
    senha_criptografada = get_password_hash(usuario.senha)
    
    db_usuario = Usuario(
        nome=usuario.nome, 
        email=usuario.email, 
        senha_hash=senha_criptografada
    )
    
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    
    return db_usuario

def atualizar_perfil(db: Session, usuario: Usuario, nome: str):
    usuario.nome = nome
    db.commit()
    db.refresh(usuario)
    return usuario

def alterar_senha(db: Session, usuario: Usuario, senha_atual: str, nova_senha: str) -> bool:
    if not verify_password(senha_atual, usuario.senha_hash):
        return False
    
    usuario.senha_hash = get_password_hash(nova_senha)
    db.commit()
    return True