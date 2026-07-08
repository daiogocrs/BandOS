from pydantic import BaseModel
from typing import Optional

class IntegranteBase(BaseModel):
    funcao: str

class IntegranteCreate(IntegranteBase):
    usuario_id: int

class IntegranteResponse(IntegranteBase):
    id: int
    usuario_id: int
    banda_id: int

    class Config:
        from_attributes = True

class BandaBase(BaseModel):
    nome: str
    descricao: Optional[str] = None

class BandaCreate(BandaBase):
    pass

class BandaResponse(BandaBase):
    id: int

    class Config:
        from_attributes = True