import pytest

DADOS_USUARIO = {"nome": "Dave Grohl", "email": "dave@foofighters.com", "senha": "123"}
DADOS_BANDA = {"nome": "Foo Fighters", "descricao": "Rock de Estádio"}
DADOS_MUSICA = {"nome": "Everlong", "artista": "Foo Fighters", "bpm": 158, "duracao": 250}
DADOS_SHOW = {
    "data_hora": "2026-10-15T20:00:00",
    "local": "Estádio de Wembley",
    "descricao": "Concerto de encerramento da tour"
}

def configurar_ambiente(client):
    """Cria utilizador, banda e devolve os headers com o token e o ID da banda."""
    client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    token = client.post("/api/v1/auth/login", data={"username": DADOS_USUARIO["email"], "password": DADOS_USUARIO["senha"]}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    banda_id = client.post("/api/v1/bandas/", json=DADOS_BANDA, headers=headers).json()["id"]
    return headers, banda_id

def test_criar_show_sucesso(client):
    """Testa a marcação de um novo show para a banda."""
    headers, banda_id = configurar_ambiente(client)
    
    response = client.post(f"/api/v1/shows/{banda_id}", json=DADOS_SHOW, headers=headers)
    
    assert response.status_code in [200, 201]
    dados = response.json()
    assert dados["local"] == DADOS_SHOW["local"]
    assert dados["banda_id"] == banda_id
    assert "id" in dados

def test_listar_shows(client):
    """Testa a listagem da agenda de shows da banda."""
    headers, banda_id = configurar_ambiente(client)
    client.post(f"/api/v1/shows/{banda_id}", json=DADOS_SHOW, headers=headers)
    
    response = client.get(f"/api/v1/shows/{banda_id}", headers=headers)
    
    assert response.status_code == 200
    lista = response.json()
    assert len(lista) == 1
    assert lista[0]["local"] == DADOS_SHOW["local"]

def test_adicionar_musica_setlist(client):
    """Testa se conseguimos colocar uma música no alinhamento do show."""
    headers, banda_id = configurar_ambiente(client)
    
    musica_id = client.post(f"/api/v1/bandas/{banda_id}/musicas", json=DADOS_MUSICA, headers=headers).json()["id"]
    
    show_id = client.post(f"/api/v1/shows/{banda_id}", json=DADOS_SHOW, headers=headers).json()["id"]
    
    dados_setlist = {"musica_id": musica_id, "ordem": 1}
    response = client.post(f"/api/v1/shows/{show_id}/setlist", json=dados_setlist, headers=headers)
    
    assert response.status_code in [200, 201]
    dados = response.json()
    assert dados["show_id"] == show_id
    assert dados["musica_id"] == musica_id
    assert dados["ordem"] == 1