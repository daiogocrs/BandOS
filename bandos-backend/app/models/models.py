from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False) 
    is_ativo = Column(Boolean, default=True)

    integrantes = relationship("Integrante", back_populates="usuario")

class Banda(Base):
    __tablename__ = "bandas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, index=True)
    descricao = Column(String, nullable=True)

    integrantes = relationship("Integrante", back_populates="banda")
    
    musicas = relationship("Musica", back_populates="banda")

    ensaios = relationship("Ensaio", back_populates="banda")

class Integrante(Base):
    __tablename__ = "integrantes"

    id = Column(Integer, primary_key=True, index=True)
    funcao = Column(String, nullable=False) 
    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    banda_id = Column(Integer, ForeignKey("bandas.id"))

    usuario = relationship("Usuario", back_populates="integrantes")
    banda = relationship("Banda", back_populates="integrantes")

class Musica(Base):
    __tablename__ = "musicas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, index=True)
    artista = Column(String, nullable=True) 
    tom = Column(String, nullable=True)     
    bpm = Column(Integer, nullable=True)    
    duracao = Column(String, nullable=True) 
    
    banda_id = Column(Integer, ForeignKey("bandas.id"))

    banda = relationship("Banda", back_populates="musicas")

class Ensaio(Base):
    __tablename__ = "ensaios"

    id = Column(Integer, primary_key=True, index=True)
    data_hora = Column(DateTime, nullable=False) 
    local = Column(String, nullable=False)       
    descricao = Column(String, nullable=True)   
    
    banda_id = Column(Integer, ForeignKey("bandas.id"))

    banda = relationship("Banda", back_populates="ensaios")