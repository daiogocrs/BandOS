from sqlalchemy import Column, Integer, ForeignKey
from app.db.database import Base

class ShowMusica(Base):
    __tablename__ = "show_musicas"

    id = Column(Integer, primary_key=True, index=True)
    show_id = Column(Integer, ForeignKey("shows.id", ondelete="CASCADE"), nullable=False)
    musica_id = Column(Integer, ForeignKey("musicas.id", ondelete="CASCADE"), nullable=False)
    ordem = Column(Integer, nullable=True)  