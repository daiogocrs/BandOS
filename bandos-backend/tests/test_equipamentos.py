import pytest

DADOS_USUARIO = {"nome": "Brian May", "email": "brian@queen.com", "senha": "123"}
DADOS_BANDA = {"nome": "Queen", "descricao": "Lendas do Rock"}

DADOS_EQUIPAMENTO = {
    "nome": "Guitarra Red Special",
    "categoria": "Instrumento de Cordas",
    "marca": "Custom Built",
    "quantidade": 1,
    "estado": "Bom" 
}

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

def test_criar_equipamento_sucesso(client):
    """Testa se conseguimos adicionar um novo equipamento ao inventário da banda."""
    headers, banda_id = configurar_ambiente(client)
    
    response = client.post(f"/api/v1/equipamentos/{banda_id}", json=DADOS_EQUIPAMENTO, headers=headers)
    
    assert response.status_code in [200, 201]
    dados = response.json()
    assert dados["nome"] == DADOS_EQUIPAMENTO["nome"]
    assert dados["estado"] == DADOS_EQUIPAMENTO["estado"]
    assert dados["banda_id"] == banda_id
    assert "id" in dados

def test_criar_equipamento_sem_autenticacao(client):
    """Garante que curiosos não conseguem adicionar coisas ao nosso inventário."""
    response = client.post("/api/v1/equipamentos/1", json=DADOS_EQUIPAMENTO)
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_listar_equipamentos_da_banda(client):
    """Testa a listagem de todo o material que a banda possui."""
    headers, banda_id = configurar_ambiente(client)
    
    client.post(f"/api/v1/equipamentos/{banda_id}", json=DADOS_EQUIPAMENTO, headers=headers)
    
    segundo_equipamento = {**DADOS_EQUIPAMENTO, "nome": "Amplificador Vox AC30", "categoria": "Áudio"}
    client.post(f"/api/v1/equipamentos/{banda_id}", json=segundo_equipamento, headers=headers)
    
    response = client.get(f"/api/v1/equipamentos/{banda_id}", headers=headers)
    
    assert response.status_code == 200
    lista = response.json()
    assert isinstance(lista, list)
    assert len(lista) == 2
    assert lista[0]["nome"] == "Guitarra Red Special"
    assert lista[1]["nome"] == "Amplificador Vox AC30"