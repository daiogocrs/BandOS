from pydantic import BaseModel
from typing import Optional

class MusicaBase(BaseModel):
    nome: str
    artista: Optional[str] = None
    tom: Optional[str] = None
    bpm: Optional[int] = None
    duracao: Optional[str] = None

class MusicaCreate(MusicaBase):
    pass

class MusicaResponse(MusicaBase):
    id: int
    banda_id: int

    class Config:
        from_attributes = True 