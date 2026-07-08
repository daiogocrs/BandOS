from enum import Enum

class EstadoEquipamento(str, Enum):
    BOM = "Bom"
    MANUTENCAO = "Manutenção"
    DANIFICADO = "Danificado"
    PERDIDO = "Perdido"