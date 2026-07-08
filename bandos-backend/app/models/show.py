from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.database import Base

class Show(Base):
    __tablename__ = "shows"

    id = Column(Integer, primary_key=True, index=True)
    data_hora = Column(DateTime, nullable=False) 
    local = Column(String(200), nullable=False)       
    descricao = Column(String(200), nullable=True)  
    
    banda_id = Column(Integer, ForeignKey("bandas.id"), nullable=False)

    banda = relationship("Banda", back_populates="shows")

    musicas = relationship("Musica", secondary="show_musicas", back_populates="shows")
