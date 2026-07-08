from pydantic import BaseModel, Field
from datetime import date
from typing import List
from app.models.enums import TipoTransacao

class TransacaoBase(BaseModel):
    descricao: str = Field(..., max_length=200, description="Descrição da movimentação")
    valor: float = Field(..., gt=0, description="O valor deve ser maior que zero")
    tipo: TipoTransacao
    data: date = Field(default_factory=date.today)

class TransacaoCreate(TransacaoBase):
    pass

class TransacaoResponse(TransacaoBase):
    id: int
    banda_id: int

    class Config:
        from_attributes = True

class ResumoFinanceiroResponse(BaseModel):
    total_entradas: float
    total_saidas: float
    saldo_atual: float
    transacoes: List[TransacaoResponse]