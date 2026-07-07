# Modelagem do Banco

## Entidades
- Usuario
- Banda
- Integrante
- Musica
- Show
- Ensaio
- Equipamento
- Financeiro

## Relacionamentos
- Banda 1:N Integrantes
- Banda 1:N Shows
- Banda 1:N Ensaios
- Banda 1:N Equipamentos
- Banda 1:N Financeiro
- Show N:N Musica (via tabela show_musicas)
