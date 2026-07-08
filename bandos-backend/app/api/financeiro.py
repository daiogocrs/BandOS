from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.financeiro import TransacaoCreate, TransacaoResponse, ResumoFinanceiroResponse
from app.services import financeiro as financeiro_service

router = APIRouter(prefix="/bandas/{banda_id}/financeiro", tags=["Financeiro"])

@router.post("/", response_model=TransacaoResponse, status_code=status.HTTP_201_CREATED)
def criar_movimentacao(banda_id: int, transacao: TransacaoCreate, db: Session = Depends(get_db)):
    """
    Regista uma nova movimentação financeira (Entrada ou Saída) para uma banda específica.
    """
    return financeiro_service.criar_transacao(db=db, transacao=transacao, banda_id=banda_id)

@router.get("/", response_model=List[TransacaoResponse])
def listar_movimentacoes(banda_id: int, db: Session = Depends(get_db)):
    """
    Lista todo o histórico de transações financeiras de uma banda, ordenado pelas mais recentes.
    """
    return financeiro_service.listar_transacoes_banda(db=db, banda_id=banda_id)

@router.get("/resumo", response_model=ResumoFinanceiroResponse)
def obter_resumo_caixa(banda_id: int, db: Session = Depends(get_db)):
    """
    Retorna o balanço completo da banda: Total de Entradas, Total de Saídas e o Saldo Atual líquido.
    """
    return financeiro_service.obter_resumo_financeiro(db=db, banda_id=banda_id)