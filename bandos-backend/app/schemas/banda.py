from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional

# ==========================================
# SCHEMAS DE INTEGRANTE
# ==========================================

class IntegranteBase(BaseModel):
    funcao: str
    papel: str = "membro" 

class IntegranteCreate(BaseModel):
    email: EmailStr
    papel: str = "membro"
    funcao: str

class IntegranteResponse(BaseModel):
    id: int
    usuario_id: int
    nome_usuario: str
    email_usuario: str
    papel: str
    funcao: str

    model_config = ConfigDict(from_attributes=True)

class IntegranteUpdate(BaseModel):
    papel: Optional[str] = None
    funcao: Optional[str] = None


# ==========================================
# SCHEMAS DE BANDA
# ==========================================

class BandaBase(BaseModel):
    nome: str
    descricao: Optional[str] = None

class BandaCreate(BandaBase):
    pass

class BandaResponse(BandaBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class BandaUpdate(BaseModel):
    nome: str
    descricao: Optional[str] = None