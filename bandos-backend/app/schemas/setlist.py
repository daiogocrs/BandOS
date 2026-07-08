from pydantic import BaseModel, ConfigDict
from typing import Optional

class SetlistAdd(BaseModel):
    musica_id: int
    ordem: Optional[int] = None

class SetlistResponse(BaseModel):
    id: int
    show_id: int
    musica_id: int
    ordem: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)