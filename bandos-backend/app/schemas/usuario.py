from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr 
    senha: str

class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: str
    is_ativo: bool

    model_config = ConfigDict(from_attributes=True)

class UsuarioUpdate(BaseModel):
    nome: str

class SenhaUpdate(BaseModel):
    senha_atual: str
    nova_senha: str