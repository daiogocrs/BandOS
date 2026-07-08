from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Musica(Base):
    __tablename__ = "musicas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False, index=True)
    artista = Column(String(100))
    tom = Column(String(50))
    bpm = Column(Integer)
    duracao = Column(Integer)

    banda_id = Column(
        Integer,
        ForeignKey("bandas.id"),
        nullable=False,
    )

    banda = relationship("Banda", back_populates="musicas")

    shows = relationship("Show", secondary="show_musicas", back_populates="musicas")