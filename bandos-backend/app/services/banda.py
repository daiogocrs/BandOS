from sqlalchemy.orm import Session
from app.models import Banda, Integrante, Usuario
from app.schemas.banda import BandaCreate, IntegranteCreate, BandaUpdate

def criar_banda(db: Session, banda_in: BandaCreate, usuario_criador: Usuario):

    nova_banda = Banda(
        nome=banda_in.nome,
        descricao=banda_in.descricao
    )

    db.add(nova_banda)
    db.flush()

    administrador = Integrante(
        usuario_id=usuario_criador.id,
        banda_id=nova_banda.id,
        papel="admin",
        funcao=None  
    )

    db.add(administrador)

    db.commit()
    db.refresh(nova_banda)

    return nova_banda


def adicionar_integrante(db: Session, banda_id: int, integrante_in: IntegranteCreate):

    novo_integrante = Integrante(
        usuario_id=integrante_in.usuario_id,
        banda_id=banda_id,
        funcao=integrante_in.funcao
    )

    db.add(novo_integrante)
    db.commit()
    db.refresh(novo_integrante)

    return novo_integrante


def listar_bandas(
    db: Session,
    usuario: Usuario,
    skip: int = 0,
    limit: int = 100
):

    return (
        db.query(Banda)
        .join(Integrante)
        .filter(Integrante.usuario_id == usuario.id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def atualizar_banda(db: Session, banda_id: int, banda_in: BandaUpdate):
    banda = db.query(Banda).filter(Banda.id == banda_id).first()
    if not banda:
        return None
    
    banda.nome = banda_in.nome
    banda.descricao = banda_in.descricao
    
    db.commit()
    db.refresh(banda)
    return banda