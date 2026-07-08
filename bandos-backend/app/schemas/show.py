from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ShowBase(BaseModel):
    data_hora: datetime
    local: str
    descricao: Optional[str] = None

class ShowCreate(ShowBase):
    pass

class ShowResponse(ShowBase):
    id: int
    banda_id: int

    model_config = ConfigDict(from_attributes=True)