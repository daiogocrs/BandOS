import pytest

DADOS_USUARIO = {"nome": "Kurt", "email": "kurt@nirvana.com", "senha": "123"}
DADOS_BANDA = {"nome": "Nirvana", "descricao": "Grunge"}

DADOS_MUSICA = {
    "nome": "Smells Like Teen Spirit",
    "artista": "Nirvana",
    "tom": "F menor",
    "bpm": 116,
    "duracao": 301
}

def configurar_ambiente(client):
    """Cria utilizador, faz login e cria uma banda. Retorna o token e o ID da banda."""
    client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    
    token = client.post(
        "/api/v1/auth/login", 
        data={"username": DADOS_USUARIO["email"], "password": DADOS_USUARIO["senha"]}
    ).json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    banda = client.post("/api/v1/bandas/", json=DADOS_BANDA, headers=headers).json()
    
    return headers, banda["id"]

def test_criar_musica_sucesso(client):
    """Testa se conseguimos adicionar uma música ao repertório da banda."""
    headers, banda_id = configurar_ambiente(client)
    
    response = client.post(f"/api/v1/bandas/{banda_id}/musicas", json=DADOS_MUSICA, headers=headers)
    
    assert response.status_code in [200, 201]
    dados = response.json()
    assert dados["nome"] == DADOS_MUSICA["nome"]
    assert dados["bpm"] == DADOS_MUSICA["bpm"]
    assert dados["banda_id"] == banda_id
    assert "id" in dados

def test_criar_musica_sem_autenticacao(client):
    """Garante que não é possível mexer no repertório sem estar logado."""
    response = client.post("/api/v1/bandas/1/musicas", json=DADOS_MUSICA)
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_listar_musicas_da_banda(client):
    """Testa se a lista de músicas de uma banda específica é retornada."""
    headers, banda_id = configurar_ambiente(client)
    
    client.post(f"/api/v1/bandas/{banda_id}/musicas", json=DADOS_MUSICA, headers=headers)
    client.post(f"/api/v1/bandas/{banda_id}/musicas", json={**DADOS_MUSICA, "nome": "Come as You Are"}, headers=headers)
    
    response = client.get(f"/api/v1/bandas/{banda_id}/musicas", headers=headers)
    
    assert response.status_code == 200
    lista = response.json()
    assert isinstance(lista, list)
    assert len(lista) == 2
    assert lista[0]["nome"] == "Smells Like Teen Spirit"
    assert lista[1]["nome"] == "Come as You Are"