from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioResponse
from app.services import usuario as usuario_service
from app.models import Usuario

router = APIRouter()

@router.post("/", response_model=UsuarioResponse)
def criar_novo_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Email já cadastrado.")
    
    return usuario_service.criar_usuario(db=db, usuario=usuario)

