from sqlalchemy.orm import Session
from app.models import Usuario
from app.schemas.usuario import UsuarioCreate
from app.core.security import get_password_hash

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