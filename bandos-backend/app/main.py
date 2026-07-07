from fastapi import FastAPI
from app.api import usuarios, auth # Importe o auth aqui

app = FastAPI(title="BandOS API", version="1.0.0")

app.include_router(usuarios.router, prefix="/api/v1/usuarios", tags=["Usuários"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticação"])

@app.get("/")
def read_root():
    return {"mensagem": "Bem-vindo ao BandOS! A API está online."}