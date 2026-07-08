from pydantic import BaseModel, ConfigDict
from typing import Optional
from enum import Enum

class EstadoEquipamento(str, Enum):
    BOM = "Bom"
    MANUTENCAO = "Manutenção"
    DANIFICADO = "Danificado"
    PERDIDO = "Perdido"

class EquipamentoBase(BaseModel):
    nome: str
    categoria: str
    marca: Optional[str] = None
    modelo: Optional[str] = None
    descricao: Optional[str] = None
    quantidade: int = 1
    estado: EstadoEquipamento = EstadoEquipamento.BOM

class EquipamentoCreate(EquipamentoBase):
    pass

class EquipamentoResponse(EquipamentoBase):
    id: int
    banda_id: int

    model_config = ConfigDict(from_attributes=True)