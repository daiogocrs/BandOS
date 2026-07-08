from sqlalchemy.orm import Session
from app.models import Equipamento
from app.schemas.equipamento import EquipamentoCreate

def criar_equipamento(db: Session, equipamento: EquipamentoCreate, banda_id: int):
    dados = equipamento.model_dump()
    
    if 'estado' in dados:
        dados['estado'] = dados['estado'].value
        
    db_equipamento = Equipamento(**dados, banda_id=banda_id)
    
    db.add(db_equipamento)
    db.commit()
    db.refresh(db_equipamento)
    return db_equipamento

def listar_equipamentos_por_banda(db: Session, banda_id: int, skip: int = 0, limit: int = 100):
    return db.query(Equipamento).filter(Equipamento.banda_id == banda_id).offset(skip).limit(limit).all()

def obter_equipamento(db: Session, equipamento_id: int):
    return db.query(Equipamento).filter(Equipamento.id == equipamento_id).first()