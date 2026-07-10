import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import { Music, ArrowLeft, Plus, Trash2, ListOrdered, ChevronRight, Disc } from 'lucide-react'

interface ItemSetlist {
  id: number
  show_id: number
  musica_id: number
  ordem: number
}

interface Musica {
  id: number
  nome: string
  artista?: string
  tom?: string
  bpm?: number
}

export function Setlist() {
  const { showId } = useParams<{ showId: string }>()
  const { bandaAtual } = useBanda()
  const navigate = useNavigate()

  const [setlist, setSetlist] = useState<ItemSetlist[]>([])
  const [repertorio, setRepertorio] = useState<Musica[]>([])
  const [loading, setLoading] = useState(true)
  const [processando, setProcessando] = useState(false)

  async function carregarDados() {
    if (!bandaAtual || !showId) return
    setLoading(true)
    try {
      const [setlistRes, musicasRes] = await Promise.all([
        api.get(`/api/v1/shows/${showId}/setlist`),
        api.get(`/api/v1/bandas/${bandaAtual.id}/musicas`)
      ])
      setSetlist(setlistRes.data)
      setRepertorio(musicasRes.data)
    } catch (error) {
      console.error("Erro ao carregar dados do setlist:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [showId, bandaAtual])

  async function handleAdicionarMusica(musicaId: number) {
    if (processando) return
    setProcessando(true)

    const proximaOrdem = setlist.length + 1

    try {
      await api.post(`/api/v1/shows/${showId}/setlist`, {
        musica_id: musicaId,
        ordem: proximaOrdem
      })
      const response = await api.get(`/api/v1/shows/${showId}/setlist`)
      setSetlist(response.data)
    } catch (error) {
      console.error("Erro ao adicionar música ao setlist:", error)
      alert("Não foi possível adicionar a música ao alinhamento.")
    } finally {
      setProcessando(false)
    }
  }

  async function handleRemoverMusica(musicaId: number) {
    if (processando) return
    setProcessando(true)
    try {
      await api.delete(`/api/v1/shows/${showId}/setlist/${musicaId}`)
      
      const response = await api.get(`/api/v1/shows/${showId}/setlist`)
      setSetlist(response.data)
    } catch (error) {
      console.error("Erro ao remover música do setlist:", error)
      alert("Erro ao remover a música.")
    } finally {
      setProcessando(false)
    }
  }

  const setlistComDetalhes = setlist.map(item => {
    const dadosMusica = repertorio.find(m => m.id === item.musica_id)
    return {
      ...item,
      nome: dadosMusica?.nome || `Música #${item.musica_id}`,
      artista: dadosMusica?.artista || 'Desconhecido',
      tom: dadosMusica?.tom || ''
    }
  }).sort((a, b) => a.ordem - b.ordem) 

  const musicasDisponiveis = repertorio.filter(
    musica => !setlist.some(item => item.musica_id === musica.id)
  )

  if (!bandaAtual) return null

  return (
    <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/shows')}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-4 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para Shows
      </button>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <ListOrdered className="text-emerald-500 h-8 w-8" />
          Montar Alinhamento (Setlist)
        </h1>
        <p className="text-zinc-400 mt-1">
          Defina a ordem das músicas para este concerto da banda <strong className="text-emerald-400">{bandaAtual.nome}</strong>
        </p>
      </header>

      {loading ? (
        <div className="text-center py-20 text-emerald-500 animate-pulse">A preparar o alinhamento... 📝</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 bg-zinc-950/40 border border-zinc-800 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 mb-2">
              🎵 Ordem do Show 
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {setlistComDetalhes.length} {setlistComDetalhes.length === 1 ? 'música' : 'músicas'}
              </span>
            </h2>

            {setlistComDetalhes.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-sm">
                <Music className="h-8 w-8 mx-auto mb-2 opacity-20" />
                O alinhamento está vazio. <br /> Adicione músicas do repertório ao lado!
              </div>
            ) : (
              <div className="space-y-2">
                {setlistComDetalhes.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-zinc-800/80 border border-zinc-700/60 p-4 rounded-lg flex items-center justify-between group transition-all hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="h-7 w-7 rounded-md bg-zinc-900 flex items-center justify-center text-sm font-mono font-bold text-emerald-400 border border-zinc-700">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-zinc-100 truncate">{item.nome}</h4>
                        <p className="text-xs text-zinc-400 truncate">{item.artista}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.tom && (
                        <span className="bg-zinc-900/80 text-zinc-400 text-[11px] font-bold px-2 py-0.5 rounded border border-zinc-700">
                          {item.tom}
                        </span>
                      )}
                      <button 
                        onClick={() => handleRemoverMusica(item.musica_id)}
                        disabled={processando}
                        className="text-zinc-500 hover:text-red-400 p-1.5 rounded transition-colors disabled:opacity-30"
                        title="Remover do show"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-700/50 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold text-zinc-300 flex items-center gap-2 mb-2">
              <Disc className="h-5 w-5 text-zinc-500" />
              Músicas Disponíveis
            </h2>

            {musicasDisponiveis.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-sm italic">
                {repertorio.length === 0 
                  ? 'O teu repertório está vazio. Cria músicas no menu Repertório!' 
                  : 'Todas as músicas do repertório já estão neste show! 🤘'}
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-800">
                {musicasDisponiveis.map(musica => (
                  <div 
                    key={musica.id} 
                    className="bg-zinc-950/40 border border-zinc-800 p-3 rounded-lg flex items-center justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="font-semibold text-sm text-zinc-200 truncate">{musica.nome}</h4>
                      <p className="text-[11px] text-zinc-400 truncate">{musica.artista}</p>
                    </div>
                    <button 
                      onClick={() => handleAdicionarMusica(musica.id)}
                      disabled={processando}
                      className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white p-1.5 rounded-md transition-all shrink-0 disabled:opacity-30"
                      title="Adicionar ao alinhamento"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}