from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Integrante(Base):
    __tablename__ = "integrantes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    banda_id = Column(Integer, ForeignKey("bandas.id"), nullable=False)
    
    papel = Column(String(50), default="membro")  
    funcao = Column(String(100), nullable=True)   

    usuario = relationship("Usuario", back_populates="integrantes")
    banda = relationship("Banda", back_populates="integrantes")