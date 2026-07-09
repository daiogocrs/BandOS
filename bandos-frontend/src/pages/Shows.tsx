import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import { Music4, Plus, MapPin, Clock, X, AlignLeft, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Show {
  id: number
  data_hora: string
  local: string
  descricao: string
  banda_id: number
}

export function Shows() {
  const { bandaAtual } = useBanda()
  const navigate = useNavigate()
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataHora, setDataHora] = useState('')
  const [local, setLocal] = useState('')
  const [descricao, setDescricao] = useState('')
  const [salvando, setSalvando] = useState(false)

  // Separar shows futuros de shows passados
  const showsFuturos = shows.filter(show => new Date(show.data_hora).getTime() >= new Date().getTime())
  const showsPassados = shows.filter(show => new Date(show.data_hora).getTime() < new Date().getTime())

  useEffect(() => {
    async function carregarShows() {
      if (!bandaAtual) return
      
      setLoading(true)
      setErro('')
      try {
        // Baseado no test_listar_shows: client.get(f"/api/v1/shows/{banda_id}")
        const response = await api.get(`/api/v1/shows/${bandaAtual.id}`)
        
        // Ordenar do mais próximo para o mais distante
        const showsOrdenados = response.data.sort((a: Show, b: Show) => 
          new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
        )
        
        setShows(showsOrdenados)
      } catch (error) {
        console.error("Erro ao carregar shows:", error)
        setErro("Não foi possível carregar a agenda de concertos.")
      } finally {
        setLoading(false)
      }
    }

    carregarShows()
  }, [bandaAtual])

  async function handleAgendarShow(e: React.FormEvent) {
    e.preventDefault()
    if (!bandaAtual) return

    setSalvando(true)
    setErro('')
    try {
      // Baseado no test_criar_show_sucesso: client.post(f"/api/v1/shows/{banda_id}")
      await api.post(`/api/v1/shows/${bandaAtual.id}`, {
        data_hora: dataHora,
        local,
        descricao
      })
      
      // Limpa e fecha
      setDataHora('')
      setLocal('')
      setDescricao('')
      setIsModalOpen(false)
      
      // Recarrega a lista
      const response = await api.get(`/api/v1/shows/${bandaAtual.id}`)
      setShows(response.data.sort((a: Show, b: Show) => 
        new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
      ))
    } catch (error: any) {
      console.error("Erro ao agendar show:", error)
      setErro(error.response?.data?.detail || "Erro ao agendar o concerto. Verifique os dados.")
    } finally {
      setSalvando(false)
    }
  }

  // Componente interno para renderizar o Card do Show
  const ShowCard = ({ show, passado = false }: { show: Show, passado?: boolean }) => (
    <div className={`bg-zinc-800 border ${passado ? 'border-zinc-800 opacity-60' : 'border-zinc-700 hover:border-emerald-500/50'} p-5 rounded-lg flex flex-col md:flex-row md:items-center gap-4 transition-colors`}>
      
      <div className={`p-3 rounded-md min-w-[150px] text-center shrink-0 ${passado ? 'bg-zinc-900/30' : 'bg-zinc-900/50 border border-zinc-700/50'}`}>
        <span className={`block font-bold capitalize text-sm mb-1 ${passado ? 'text-zinc-500' : 'text-emerald-500'}`}>
          {new Date(show.data_hora).toLocaleDateString('pt-BR', { weekday: 'short' })}
        </span>
        <span className={`block text-2xl font-black ${passado ? 'text-zinc-400' : 'text-zinc-100'}`}>
          {new Date(show.data_hora).getDate()} {new Date(show.data_hora).toLocaleDateString('pt-BR', { month: 'short' })}
        </span>
        <span className="flex items-center justify-center gap-1 text-zinc-500 text-xs mt-1 font-mono">
          <Clock className="h-3 w-3" />
          {new Date(show.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-lg flex items-center gap-2 mb-2 truncate ${passado ? 'text-zinc-400' : 'text-zinc-100'}`}>
          <MapPin className={`h-4 w-4 shrink-0 ${passado ? 'text-zinc-500' : 'text-emerald-500'}`} />
          {show.local}
        </h3>
        {show.descricao && (
          <p className="text-zinc-500 text-sm flex items-start gap-2 line-clamp-2">
            <AlignLeft className="h-4 w-4 shrink-0 mt-0.5" />
            {show.descricao}
          </p>
        )}
      </div>

      <div className="shrink-0 flex items-center justify-end mt-4 md:mt-0">
        <button 
          onClick={() => alert('Em breve: Página de Gestão de Setlist!')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${passado ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-300' : 'bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20'}`}
        >
          {passado ? 'Ver Setlist' : 'Montar Setlist'}
        </button>
      </div>
    </div>
  )

  if (!bandaAtual) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4 pt-20">
        <Music4 className="h-16 w-16 opacity-20" />
        <p>Selecione ou crie uma banda para gerir os concertos.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <Music4 className="text-emerald-500 h-8 w-8" />
            Agenda de Shows
          </h1>
          <p className="text-zinc-400 mt-1">
            Planeie os concertos da <strong className="text-emerald-400">{bandaAtual.nome}</strong>
          </p>
        </div>
        
        <button 
          onClick={() => {setIsModalOpen(true); setErro('');}}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md font-semibold transition-colors shadow-lg shadow-emerald-900/20"
        >
          <Plus className="h-5 w-5" />
          Marcar Show
        </button>
      </header>

      {erro && !isModalOpen && (
        <div className="bg-red-500/20 text-red-400 p-4 rounded-md mb-6 border border-red-500/30">
          {erro}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-emerald-500 animate-pulse">A procurar datas... 🌍</div>
      ) : shows.length === 0 ? (
        <div className="text-center py-20 bg-zinc-800/30 border border-zinc-800/50 rounded-lg text-zinc-500">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>Nenhum concerto na agenda. Está na hora de ligar aos promotores!</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* SECÇÃO: Próximos Shows */}
          {showsFuturos.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
                Próximas Datas <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">{showsFuturos.length}</span>
              </h2>
              <div className="space-y-4">
                {showsFuturos.map(show => <ShowCard key={show.id} show={show} />)}
              </div>
            </section>
          )}

          {/* SECÇÃO: Histórico (Shows Passados) */}
          {showsPassados.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-zinc-500 mb-4 border-t border-zinc-800 pt-8">Histórico de Concertos</h2>
              <div className="space-y-4">
                {showsPassados.map(show => <ShowCard key={show.id} show={show} passado={true} />)}
              </div>
            </section>
          )}

        </div>
      )}

      {/* Modal de Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100">
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
              <Music4 className="h-5 w-5" />
              Novo Show
            </h2>

            {erro && (
              <div className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4 border border-red-500/30">
                {erro}
              </div>
            )}

            <form onSubmit={handleAgendarShow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Data e Hora *</label>
                <input 
                  required 
                  type="datetime-local" 
                  value={dataHora} 
                  onChange={(e) => setDataHora(e.target.value)} 
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none [color-scheme:dark]" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Local / Evento *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Ex: Hard Rock Cafe, Festival de Verão..."
                  value={local} 
                  onChange={(e) => setLocal(e.target.value)} 
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Detalhes (Opcional)</label>
                <textarea 
                  placeholder="Informações sobre cachet, horário de montagem, backline partilhado..."
                  value={descricao} 
                  onChange={(e) => setDescricao(e.target.value)} 
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none resize-none min-h-[80px]" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md font-medium text-zinc-300 hover:bg-zinc-800">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="px-4 py-2 rounded-md font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50">
                  {salvando ? 'A Agendar...' : 'Marcar Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}