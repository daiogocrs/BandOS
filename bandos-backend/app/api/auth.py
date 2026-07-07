from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models import Usuario
from app.core.security import verify_password, criar_token_acesso
from app.schemas.token import Token

router = APIRouter()

@router.post("/login", response_model=Token)
def login_para_obter_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    
    if not usuario or not verify_password(form_data.password, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token_acesso = criar_token_acesso(data={"sub": usuario.email})
    
    return {"access_token": token_acesso, "token_type": "bearer"}