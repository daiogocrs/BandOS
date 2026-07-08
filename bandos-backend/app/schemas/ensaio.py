from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EnsaioBase(BaseModel):
    data_hora: datetime
    local: str
    descricao: Optional[str] = None

class EnsaioCreate(EnsaioBase):
    pass

class EnsaioResponse(EnsaioBase):
    id: int
    banda_id: int

    class Config:
        from_attributes = True