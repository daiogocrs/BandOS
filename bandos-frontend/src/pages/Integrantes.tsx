import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import { Users, UserPlus, Shield, Mic2, X, Mail } from 'lucide-react'

interface Integrante {
  id: number
  usuario_id: number
  nome_usuario: string
  email_usuario: string
  papel: string // ex: 'admin' ou 'membro'
  funcao: string // ex: 'Guitarrista', 'Vocalista'
}

export function Integrantes() {
  const { bandaAtual } = useBanda()
  const [integrantes, setIntegrantes] = useState<Integrante[]>([])
  const [loading, setLoading] = useState(false)

  // Estados do Modal de Adicionar Integrante
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [emailNovo, setEmailNovo] = useState('')
  const [papelNovo, setPapelNovo] = useState('membro')
  const [funcaoNova, setFuncaoNova] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarIntegrantes() {
      if (!bandaAtual) return
      
      setLoading(true)
      try {
        // Ajuste a rota se o seu backend for diferente!
        const response = await api.get(`/api/v1/bandas/${bandaAtual.id}/integrantes`)
        setIntegrantes(response.data)
      } catch (error) {
        console.error("Erro ao carregar integrantes:", error)
      } finally {
        setLoading(false)
      }
    }

    carregarIntegrantes()
  }, [bandaAtual])

  async function handleAdicionarIntegrante(e: React.FormEvent) {
    e.preventDefault()
    if (!bandaAtual) return

    setErro('')
    setSalvando(true)
    try {
      await api.post(`/api/v1/bandas/${bandaAtual.id}/integrantes`, {
        email: emailNovo, // Presumindo que você convida a pessoa pelo email de cadastro dela
        papel: papelNovo, // Cargo no sistema
        funcao: funcaoNova // Instrumento/Função na banda
      })
      
      // Limpa form e fecha modal
      setEmailNovo('')
      setPapelNovo('membro')
      setFuncaoNova('')
      setIsModalOpen(false)
      
      // Recarrega a lista
      const response = await api.get(`/api/v1/bandas/${bandaAtual.id}/integrantes`)
      setIntegrantes(response.data)
    } catch (error: any) {
      console.error("Erro ao adicionar integrante:", error)
      // Se o backend retornar um erro específico (ex: "Usuário não encontrado"), mostramos aqui
      setErro(error.response?.data?.detail || "Erro ao adicionar integrante. Verifique se o e-mail está cadastrado no BandOS.")
    } finally {
      setSalvando(false)
    }
  }

  if (!bandaAtual) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4 pt-20">
        <Users className="h-16 w-16 opacity-20" />
        <p>Selecione ou crie uma banda no menu lateral para gerir os integrantes.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <Users className="text-emerald-500 h-8 w-8" />
            Integrantes
          </h1>
          <p className="text-zinc-400 mt-1">
            Quem faz o som acontecer na <strong className="text-emerald-400">{bandaAtual.nome}</strong>
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md font-semibold transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          Adicionar Membro
        </button>
      </header>

      {/* Lista de Integrantes */}
      {loading ? (
        <div className="text-center py-20 text-emerald-500 animate-pulse">A procurar a malta... 🥁</div>
      ) : integrantes.length === 0 ? (
        <div className="text-center py-20 bg-zinc-800/30 border border-zinc-800/50 rounded-lg text-zinc-500">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>Você é uma banda de um homem só! Adicione mais membros para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrantes.map(integrante => (
            <div key={integrante.id} className="bg-zinc-800 border border-zinc-700 hover:border-emerald-500/50 p-5 rounded-lg flex items-center gap-4 transition-colors group">
              {/* Avatar Simples */}
              <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-500 font-bold shrink-0">
                {integrante.nome_usuario?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-zinc-100 text-lg truncate flex items-center gap-2">
                  {integrante.nome_usuario || 'Usuário'}
                  {integrante.papel === 'admin' && (
                    <Shield className="h-4 w-4 text-emerald-500" title="Administrador" />
                  )}
                </h3>
                <p className="text-zinc-400 text-sm truncate flex items-center gap-1">
                  <Mic2 className="h-3 w-3" />
                  {integrante.funcao || 'Sem função definida'}
                </p>
                <p className="text-zinc-500 text-xs truncate mt-1">
                  {integrante.email_usuario}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Novo Integrante */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => { setIsModalOpen(false); setErro(''); }} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100">
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Adicionar à Banda
            </h2>

            {erro && (
              <div className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4 border border-red-500/30">
                {erro}
              </div>
            )}

            <form onSubmit={handleAdicionarIntegrante} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  Email do Utilizador *
                </label>
                <input 
                  required 
                  type="email" 
                  placeholder="email@cadastrado.com"
                  value={emailNovo} 
                  onChange={(e) => setEmailNovo(e.target.value)} 
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none placeholder:text-zinc-600" 
                />
                <span className="text-xs text-zinc-500 mt-1 block">
                  O utilizador já deve ter uma conta criada no BandOS.
                </span>
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Cargo (Sistema) *</label>
                  <select 
                    value={papelNovo} 
                    onChange={(e) => setPapelNovo(e.target.value)} 
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none"
                  >
                    <option value="membro">Membro</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Função (Banda) *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ex: Baixista"
                    value={funcaoNova} 
                    onChange={(e) => setFuncaoNova(e.target.value)} 
                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none placeholder:text-zinc-600" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800 mt-6">
                <button type="button" onClick={() => { setIsModalOpen(false); setErro(''); }} className="px-4 py-2 rounded-md font-medium text-zinc-300 hover:bg-zinc-800">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="px-4 py-2 rounded-md font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50">
                  {salvando ? 'A Adicionar...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}