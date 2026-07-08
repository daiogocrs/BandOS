from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.enums import EstadoEquipamento

class Equipamento(Base):
    __tablename__ = "equipamentos"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String(100), nullable=False)

    categoria = Column(
        String(100),
        nullable=False,
        index=True,
    )

    marca = Column(String(100))
    modelo = Column(String(100))
    descricao = Column(String(200))

    quantidade = Column(
        Integer,
        nullable=False,
        default=1,
    )

    estado = Column(
        String(50),
        nullable=False,
        default=EstadoEquipamento.BOM.value,
    )

    banda_id = Column(
        Integer,
        ForeignKey("bandas.id"),
        nullable=False,
    )

    banda = relationship(
        "Banda",
        back_populates="equipamentos",
    )