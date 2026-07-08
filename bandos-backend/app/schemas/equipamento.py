from pydantic import BaseModel
from typing import Optional

class EquipamentoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    quantidade: int

class EquipamentoCreate(EquipamentoBase):
    pass

class EquipamentoResponse(EquipamentoBase):
    id: int

    class Config:
        orm_mode = True

class EquipamentoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    quantidade: Optional[int] = None

    class Config:
        orm_mode = True
        from_attributes = True

class EquipamentoDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True
        