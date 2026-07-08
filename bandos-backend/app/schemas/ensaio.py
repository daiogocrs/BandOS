from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)