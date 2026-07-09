import { useEffect, useState } from 'react'
import { api } from '../services/api'

export function Dashboard() {
  const [nomeUsuario, setNomeUsuario] = useState('Carregando...')

  useEffect(() => {
    async function carregarDados() {
      try {
        const response = await api.get('/api/v1/usuarios/me') 
        setNomeUsuario(response.data.nome)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setNomeUsuario("Utilizador")
      }
    }

    carregarDados()
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Olá, {nomeUsuario}! 👋</h1>
        <p className="text-zinc-400">Aqui está o resumo da atividade da sua banda.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-zinc-100 mb-2">🎤 Próximo Ensaio</h2>
          <p className="text-sm text-zinc-400">Nenhum ensaio agendado por enquanto.</p>
        </div>
        
        <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-zinc-100 mb-2">🎸 Próximo Show</h2>
          <p className="text-sm text-zinc-400">Nenhum concerto planeado.</p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-zinc-100 mb-2">🎵 Repertório</h2>
          <p className="text-sm text-zinc-400">Aceda ao menu lateral para gerir as suas músicas.</p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-lg shadow-sm">
          <h2 className="font-bold text-xl text-zinc-100 mb-2">💰 Financeiro</h2>
          <p className="text-sm text-zinc-400">Fluxo de caixa será atualizado em breve.</p>
        </div>
      </div>
    </div>
  )
}