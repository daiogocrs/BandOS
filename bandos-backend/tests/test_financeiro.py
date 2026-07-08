import pytest

DADOS_USUARIO = {"nome": "Contador", "email": "contador@bandos.com", "senha": "123"}
DADOS_BANDA = {"nome": "The Bankers", "descricao": "Rock Financeiro"}

def configurar_ambiente(client):
    """Cria utilizador, banda e devolve os headers com o token e o ID da banda."""
    client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    
    token = client.post(
        "/api/v1/auth/login", 
        data={"username": DADOS_USUARIO["email"], "password": DADOS_USUARIO["senha"]}
    ).json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    banda_id = client.post("/api/v1/bandas/", json=DADOS_BANDA, headers=headers).json()["id"]
    
    return headers, banda_id

def test_fluxo_completo_financeiro(client):
    """Testa se o fluxo de caixa (entradas, saídas e resumo matemático) funciona corretamente."""
    
    headers, banda_id = configurar_ambiente(client)
    
    payload_entrada = {
        "descricao": "Cachê do Concerto no Hard Club",
        "valor": 1000.00,
        "tipo": "entrada",
        "data": "2023-11-01"
    }
    response_entrada = client.post(f"/api/v1/bandas/{banda_id}/financeiro/", json=payload_entrada, headers=headers)
    assert response_entrada.status_code == 201, f"Falha na entrada: {response_entrada.text}"
    assert response_entrada.json()["valor"] == 1000.00
    assert response_entrada.json()["tipo"] == "entrada"

    payload_saida = {
        "descricao": "Conserto do amplificador",
        "valor": 250.00,
        "tipo": "saida",
        "data": "2023-11-05"
    }
    response_saida = client.post(f"/api/v1/bandas/{banda_id}/financeiro/", json=payload_saida, headers=headers)
    assert response_saida.status_code == 201, f"Falha na saída: {response_saida.text}"
    assert response_saida.json()["valor"] == 250.00

    response_lista = client.get(f"/api/v1/bandas/{banda_id}/financeiro/", headers=headers)
    assert response_lista.status_code == 200
    assert len(response_lista.json()) == 2 

    response_resumo = client.get(f"/api/v1/bandas/{banda_id}/financeiro/resumo", headers=headers)
    assert response_resumo.status_code == 200
    
    dados_resumo = response_resumo.json()
    assert dados_resumo["total_entradas"] == 1000.00
    assert dados_resumo["total_saidas"] == 250.00
    assert dados_resumo["saldo_atual"] == 750.00