from enum import Enum

class TipoTransacao(str, Enum):
    ENTRADA = "entrada"
    SAIDA = "saida"

class EstadoEquipamento(str, Enum):
    BOM = "Bom"
    MANUTENCAO = "Manutenção"
    DANIFICADO = "Danificado"
    PERDIDO = "Perdido"