import pytest

DADOS_USUARIO = {
    "nome": "Freddie Mercury",
    "email": "freddie@queen.com",
    "senha": "wearethechampions"
}

DADOS_USUARIO2 = {
    "nome": "Kurt Cobain",
    "email": "kurt@nirvana.com",
    "senha": "nirvana"
}

DADOS_BANDA = {
    "nome": "Queen",
    "descricao": "Banda britânica de rock"
}

def obter_token_auth(client, dados_usuario=DADOS_USUARIO):

    client.post(
        "/api/v1/usuarios/",
        json=dados_usuario
    )

    resposta = client.post(
        "/api/v1/auth/login",
        data={
            "username": dados_usuario["email"],
            "password": dados_usuario["senha"]
        }
    )

    return resposta.json()["access_token"]

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

def test_usuario_lista_apenas_suas_bandas(client):

    token = obter_token_auth(client)

    headers = {
        "Authorization": f"Bearer {token}"
    }

    client.post(
        "/api/v1/bandas/",
        json=DADOS_BANDA,
        headers=headers
    )

    response = client.get(
        "/api/v1/bandas/",
        headers=headers
    )

    assert response.status_code == 200

    bandas = response.json()

    assert len(bandas) == 1
    assert bandas[0]["nome"] == "Queen"

def test_usuario_nao_ve_bandas_de_outros(client):

    token1 = obter_token_auth(client)

    headers1 = {
        "Authorization": f"Bearer {token1}"
    }

    client.post(
        "/api/v1/bandas/",
        json=DADOS_BANDA,
        headers=headers1
    )

    token2 = obter_token_auth(client, DADOS_USUARIO2)

    headers2 = {
        "Authorization": f"Bearer {token2}"
    }

    response = client.get(
        "/api/v1/bandas/",
        headers=headers2
    )

    assert response.status_code == 200
    assert response.json() == []