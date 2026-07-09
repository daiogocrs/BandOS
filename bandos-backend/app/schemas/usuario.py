from pydantic import BaseModel, EmailStr, ConfigDict

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