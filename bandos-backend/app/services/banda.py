from sqlalchemy.orm import Session
from app.models import Banda, Integrante, Usuario
from app.schemas.banda import BandaCreate, IntegranteCreate

def criar_banda(db: Session, banda_in: BandaCreate, usuario_criador: Usuario):
    nova_banda = Banda(nome=banda_in.nome, descricao=banda_in.descricao)
    db.add(nova_banda)
    db.commit()
    db.refresh(nova_banda)

    novo_integrante = Integrante(
        funcao="Administrador/Criador",
        usuario_id=usuario_criador.id,
        banda_id=nova_banda.id
    )
    db.add(novo_integrante)
    db.commit()

    return nova_banda

def adicionar_integrante(db: Session, banda_id: int, integrante_in: IntegranteCreate):
    novo_integrante = Integrante(
        funcao=integrante_in.funcao,
        usuario_id=integrante_in.usuario_id,
        banda_id=banda_id
    )
    db.add(novo_integrante)
    db.commit()
    db.refresh(novo_integrante)
    return novo_integrante