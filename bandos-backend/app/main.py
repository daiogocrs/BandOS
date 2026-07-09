from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import usuarios, auth, bandas, musicas, ensaios, shows, equipamentos, financeiro

app = FastAPI(title="BandOS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(usuarios.router, prefix="/api/v1/usuarios", tags=["Usuários"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticação"])
app.include_router(bandas.router, prefix="/api/v1/bandas", tags=["Bandas"])
app.include_router(musicas.router, prefix="/api/v1", tags=["Repertório"]) 
app.include_router(ensaios.router, prefix="/api/v1", tags=["Ensaios"])
app.include_router(shows.router, prefix="/api/v1/shows", tags=["Shows"])
app.include_router(equipamentos.router, prefix="/api/v1/equipamentos", tags=["Equipamentos"])
app.include_router(financeiro.router, prefix="/api/v1", tags=["Financeiro"])

@app.get("/")
def read_root():
    return {"mensagem": "Bem-vindo ao BandOS! A API está online."}