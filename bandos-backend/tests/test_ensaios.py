import pytest
from datetime import datetime, timedelta

DADOS_USUARIO = {"nome": "Lars Ulrich", "email": "lars@metallica.com", "senha": "123"}
DADOS_BANDA = {"nome": "Metallica", "descricao": "Thrash Metal"}
DADOS_ENSAIO = {
    "data_hora": (datetime.now() + timedelta(days=7)).isoformat(),
    "local": "Garagem do Lars",
    "descricao": "Ensaio de aquecimento"
}

def configurar_ambiente(client):
    client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    token = client.post("/api/v1/auth/login", data={"username": DADOS_USUARIO["email"], "password": DADOS_USUARIO["senha"]}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    banda_id = client.post("/api/v1/bandas/", json=DADOS_BANDA, headers=headers).json()["id"]
    return headers, banda_id

def test_criar_ensaio_sucesso(client):
    """Testa a criação de um ensaio agendado para o futuro."""
    headers, banda_id = configurar_ambiente(client)
    
    response = client.post(f"/api/v1/bandas/{banda_id}/ensaios", json=DADOS_ENSAIO, headers=headers)
    
    assert response.status_code in [200, 201]
    assert response.json()["local"] == DADOS_ENSAIO["local"]

def test_criar_ensaio_data_passada(client):
    """Testa se o sistema bloqueia ensaios em datas que já passaram."""
    headers, banda_id = configurar_ambiente(client)
    
    dados_passados = DADOS_ENSAIO.copy()
    dados_passados["data_hora"] = (datetime.now() - timedelta(days=1)).isoformat()
    
    response = client.post(f"/api/v1/bandas/{banda_id}/ensaios", json=dados_passados, headers=headers)
    
    assert response.status_code == 400

def test_listar_ensaios(client):
    """Testa se os ensaios da banda são listados corretamente."""
    headers, banda_id = configurar_ambiente(client)
    client.post(f"/api/v1/bandas/{banda_id}/ensaios", json=DADOS_ENSAIO, headers=headers)
    
    response = client.get(f"/api/v1/bandas/{banda_id}/ensaios", headers=headers)
    
    assert response.status_code == 200
    assert len(response.json()) == 1