import pytest

DADOS_USUARIO = {
    "nome": "João do Rock",
    "email": "joao@bandos.com",
    "senha": "senha_super_segura"
}

def test_criar_usuario_sucesso(client):
    """Testa se um novo usuário é criado corretamente."""
    response = client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    
    assert response.status_code == 200
    dados_retorno = response.json()
    assert dados_retorno["email"] == DADOS_USUARIO["email"]
    assert dados_retorno["nome"] == DADOS_USUARIO["nome"]
    assert "id" in dados_retorno
    assert "senha" not in dados_retorno  

def test_criar_usuario_email_duplicado(client):
    """Testa se o sistema bloqueia a criação de usuários com o mesmo email."""
    client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    
    response = client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Email já cadastrado."

def test_login_sucesso(client):
    """Testa se o usuário consegue fazer login e recebe um token JWT."""
    client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    
    response = client.post(
        "/api/v1/auth/login", 
        data={"username": DADOS_USUARIO["email"], "password": DADOS_USUARIO["senha"]}
    )
    
    assert response.status_code == 200
    dados_retorno = response.json()
    assert "access_token" in dados_retorno
    assert dados_retorno["token_type"] == "bearer"

def test_login_senha_incorreta(client):
    """Testa o bloqueio de login com senha errada."""
    client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    
    response = client.post(
        "/api/v1/auth/login", 
        data={"username": DADOS_USUARIO["email"], "password": "senha_errada"}
    )
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Email ou senha incorretos"

def test_login_usuario_inexistente(client):
    """Testa o bloqueio de login para um email que não existe."""
    response = client.post(
        "/api/v1/auth/login", 
        data={"username": "fantasma@bandos.com", "password": "123"}
    )
    
    assert response.status_code == 401

def test_obter_usuario_atual_com_token(client):
    """Testa se o sistema reconhece o usuário logado lendo o token."""
    client.post("/api/v1/usuarios/", json=DADOS_USUARIO)
    login_response = client.post(
        "/api/v1/auth/login", 
        data={"username": DADOS_USUARIO["email"], "password": DADOS_USUARIO["senha"]}
    )
    token = login_response.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/usuarios/me", headers=headers)
    
    assert response.status_code == 200
    assert response.json()["email"] == DADOS_USUARIO["email"]

def test_acessar_rota_protegida_sem_token(client):
    """Testa se o sistema barra quem tenta acessar rotas protegidas sem estar logado."""
    response = client.get("/api/v1/usuarios/me")
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"