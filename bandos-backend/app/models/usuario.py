from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    senha_hash = Column(String(200), nullable=False)
    is_ativo = Column(Boolean, default=True)

    integrantes = relationship(
        "Integrante",
        back_populates="usuario",
        cascade="all, delete-orphan",
    )