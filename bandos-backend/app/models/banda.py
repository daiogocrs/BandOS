from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class Banda(Base):
    __tablename__ = "bandas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False, index=True)
    descricao = Column(String(200))

    integrantes = relationship(
        "Integrante",
        back_populates="banda",
        cascade="all, delete-orphan",
    )

    musicas = relationship(
        "Musica",
        back_populates="banda",
        cascade="all, delete-orphan",
    )

    ensaios = relationship(
        "Ensaio",
        back_populates="banda",
        cascade="all, delete-orphan",
    )

    shows = relationship(
        "Show",
        back_populates="banda",
        cascade="all, delete-orphan",
    )

    equipamentos = relationship(
        "Equipamento",
        back_populates="banda",
        cascade="all, delete-orphan",
    )

    transacoes = relationship(
        "Transacao", 
        back_populates="banda", 
        cascade="all, delete-orphan"
    )