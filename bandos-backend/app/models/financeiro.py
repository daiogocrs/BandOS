from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from datetime import date
from app.db.database import Base
from app.models.enums import TipoTransacao

class Transacao(Base):
    __tablename__ = "financeiro"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String(200), nullable=False)
    valor = Column(Float, nullable=False)
    tipo = Column(Enum(TipoTransacao), nullable=False)
    data = Column(Date, default=date.today, nullable=False)
    
    banda_id = Column(Integer, ForeignKey("bandas.id"), nullable=False)
    
    banda = relationship("Banda", back_populates="transacoes")