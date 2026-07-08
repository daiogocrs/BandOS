from fastapi import FastAPI
from app.api import usuarios, auth, bandas, musicas

app = FastAPI(title="BandOS API", version="1.0.0")

app.include_router(usuarios.router, prefix="/api/v1/usuarios", tags=["Usuários"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticação"])
app.include_router(bandas.router, prefix="/api/v1/bandas", tags=["Bandas"])
app.include_router(musicas.router, prefix="/api/v1", tags=["Repertório"]) 

@app.get("/")
def read_root():
    return {"mensagem": "Bem-vindo ao BandOS! A API está online."}