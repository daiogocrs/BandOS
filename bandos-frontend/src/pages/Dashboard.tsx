import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export function Dashboard() {
  const { logout } = useAuth()
  const [nomeUsuario, setNomeUsuario] = useState('Carregando...')

  useEffect(() => {
    async function carregarDados() {
      try {
        const response = await api.get('/api/v1/usuarios/me') 
        setNomeUsuario(response.data.nome)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setNomeUsuario("Erro ao carregar dados.")
      }
    }

    carregarDados()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 text-zinc-100 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-zinc-800 p-8 shadow-lg text-center">
        <h1 className="mb-2 text-4xl font-bold text-emerald-500">Dashboard 🎸</h1>
        <p className="text-xl text-zinc-300 mb-8">
          Bem-vindo(a) à área logada, <span className="font-bold text-emerald-400">{nomeUsuario}</span>!
        </p>

        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-zinc-700 p-4 rounded-md">
            <h2 className="font-bold text-lg text-zinc-100">Próximo Ensaio</h2>
            <p className="text-sm text-zinc-400">Em breve...</p>
          </div>
          <div className="bg-zinc-700 p-4 rounded-md">
            <h2 className="font-bold text-lg text-zinc-100">Próximo Show</h2>
            <p className="text-sm text-zinc-400">Em breve...</p>
          </div>
          <div className="bg-zinc-700 p-4 rounded-md">
            <h2 className="font-bold text-lg text-zinc-100">Repertório</h2>
            <p className="text-sm text-zinc-400">0 músicas</p>
          </div>
          <div className="bg-zinc-700 p-4 rounded-md">
            <h2 className="font-bold text-lg text-zinc-100">Financeiro</h2>
            <p className="text-sm text-zinc-400">R$ 0,00 em caixa</p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="mt-8 w-full sm:w-auto rounded-md bg-red-600 px-8 py-2 font-semibold text-white transition-colors hover:bg-red-500"
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  )
}