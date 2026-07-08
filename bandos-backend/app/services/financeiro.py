from sqlalchemy.orm import Session
from app.models.financeiro import Transacao
from app.models.enums import TipoTransacao
from app.schemas.financeiro import TransacaoCreate

def criar_transacao(db: Session, transacao: TransacaoCreate, banda_id: int) -> Transacao:
    dados = transacao.model_dump()
    
    db_transacao = Transacao(
        **dados,
        banda_id=banda_id
    )
    db.add(db_transacao)
    db.commit()
    db.refresh(db_transacao)
    return db_transacao

def listar_transacoes_banda(db: Session, banda_id: int):
    return db.query(Transacao).filter(Transacao.banda_id == banda_id).order_by(Transacao.data.desc()).all()

def obter_resumo_financeiro(db: Session, banda_id: int) -> dict:
    transacoes = db.query(Transacao).filter(Transacao.banda_id == banda_id).all()
    
    total_entradas = sum(t.valor for t in transacoes if t.tipo == TipoTransacao.ENTRADA)
    total_saidas = sum(t.valor for t in transacoes if t.tipo == TipoTransacao.SAIDA)
    saldo_atual = total_entradas - total_saidas
    
    return {
        "total_entradas": total_entradas,
        "total_saidas": total_saidas,
        "saldo_atual": saldo_atual,
        "transacoes": transacoes
    }