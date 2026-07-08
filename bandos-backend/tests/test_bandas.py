import pytest

DADOS_USUARIO = {
    "nome": "Freddie Mercury",
    "email": "freddie@queen.com",
    "senha": "wearethechampions"
}

DADOS_BANDA = {
    "nome": "Queen",
    "descricao": "Banda britânica de rock"
}

def obter_token_auth(client):
    """Função auxiliar para criar um utilizador e fazer login, retornando o token JWT."""
    client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    resposta_login = client.post(
        "/api/v1/auth/login", 
        data={"username": DADOS_USUARIO["email"], "password": DADOS_USUARIO["senha"]}
    )
    return resposta_login.json()["access_token"]

def test_criar_banda_sem_autenticacao(client):
    """Garante que um utilizador anônimo não consegue criar uma banda."""
    response = client.post("/api/v1/bandas/", json=DADOS_BANDA)
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_criar_banda_com_sucesso(client):
    """Testa a criação de uma banda usando um token válido."""
    token = obter_token_auth(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post("/api/v1/bandas/", json=DADOS_BANDA, headers=headers)
    
    assert response.status_code in [200, 201] 
    
    dados = response.json()
    assert dados["nome"] == DADOS_BANDA["nome"]
    assert dados["descricao"] == DADOS_BANDA["descricao"]
    assert "id" in dados

def test_listar_bandas(client):
    """Testa se a banda criada aparece na lista geral."""
    token = obter_token_auth(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    client.post("/api/v1/bandas/", json=DADOS_BANDA, headers=headers)
    
    response = client.get("/api/v1/bandas/", headers=headers)
    
    assert response.status_code == 200
    lista_bandas = response.json()
    
    assert isinstance(lista_bandas, list)
    assert len(lista_bandas) > 0
    assert lista_bandas[0]["nome"] == DADOS_BANDA["nome"]