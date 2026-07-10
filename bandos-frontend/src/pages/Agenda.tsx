import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import { CalendarDays, MapPin, Clock, Mic2, Music4, AlignLeft } from 'lucide-react'

interface EventoAgenda {
  id: string
  tipo: 'Ensaio' | 'Show'
  data_hora: string
  local: string
  descricao: string
  original_id: number
}

export function Agenda() {
  const { bandaAtual } = useBanda()
  const [eventos, setEventos] = useState<EventoAgenda[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarAgenda() {
      if (!bandaAtual) return
      
      setLoading(true)
      setErro('')
      
      try {
        const [showsRes, ensaiosRes] = await Promise.all([
          api.get(`/api/v1/shows/${bandaAtual.id}`),
          api.get(`/api/v1/bandas/${bandaAtual.id}/ensaios`)
        ])

        const showsFormatados: EventoAgenda[] = showsRes.data.map((show: any) => ({
          id: `show-${show.id}`,
          tipo: 'Show',
          data_hora: show.data_hora,
          local: show.local,
          descricao: show.descricao,
          original_id: show.id
        }))

        const ensaiosFormatados: EventoAgenda[] = ensaiosRes.data.map((ensaio: any) => ({
          id: `ensaio-${ensaio.id}`,
          tipo: 'Ensaio',
          data_hora: ensaio.data_hora,
          local: ensaio.local,
          descricao: ensaio.descricao,
          original_id: ensaio.id
        }))

        const todosEventos = [...showsFormatados, ...ensaiosFormatados].sort((a, b) => 
          new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
        )

        setEventos(todosEventos)
      } catch (error) {
        console.error("Erro ao carregar a agenda:", error)
        setErro("Não foi possível carregar a sua agenda no momento.")
      } finally {
        setLoading(false)
      }
    }

    carregarAgenda()
  }, [bandaAtual])

  const agora = new Date().getTime()
  const eventosFuturos = eventos.filter(e => new Date(e.data_hora).getTime() >= agora)
  const eventosPassados = eventos.filter(e => new Date(e.data_hora).getTime() < agora).reverse() 

  const EventoCard = ({ evento, passado = false }: { evento: EventoAgenda, passado?: boolean }) => {
    const isShow = evento.tipo === 'Show'
    
    return (
      <div className={`relative pl-8 md:pl-0 transition-all ${passado ? 'opacity-60 grayscale-[50%]' : ''}`}>
        
        <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 h-full">
          <div className={`h-full w-0.5 ${passado ? 'bg-zinc-800' : 'bg-emerald-900/50'}`}></div>
          <div className={`absolute top-6 h-4 w-4 rounded-full border-4 border-zinc-950 ${isShow ? 'bg-emerald-500' : 'bg-blue-500'} ${passado ? 'bg-zinc-600' : ''}`}></div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-12 items-center mb-8">
          
          <div className="hidden md:flex justify-end pr-8">
            <div className="text-right">
              <span className={`block font-bold capitalize ${passado ? 'text-zinc-500' : 'text-emerald-500'}`}>
                {new Date(evento.data_hora).toLocaleDateString('pt-BR', { weekday: 'long' })}
              </span>
              <span className={`block text-3xl font-black ${passado ? 'text-zinc-400' : 'text-zinc-100'}`}>
                {new Date(evento.data_hora).getDate()} {new Date(evento.data_hora).toLocaleDateString('pt-BR', { month: 'long' })}
              </span>
              <span className="flex items-center justify-end gap-1 text-zinc-400 font-mono mt-1">
                <Clock className="h-4 w-4" />
                {new Date(evento.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="pl-0 md:pl-8">
            <div className={`bg-zinc-900 border ${passado ? 'border-zinc-800' : 'border-zinc-700 hover:border-emerald-500/50'} p-5 rounded-xl shadow-lg`}>
              
              <div className="md:hidden flex items-center gap-2 mb-3 pb-3 border-b border-zinc-800 text-zinc-300 font-semibold">
                <CalendarDays className="h-4 w-4 text-emerald-500" />
                {new Date(evento.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às {new Date(evento.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${isShow ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {isShow ? <Music4 className="h-3 w-3" /> : <Mic2 className="h-3 w-3" />}
                  {evento.tipo}
                </span>
              </div>

              <h3 className="font-bold text-zinc-100 text-lg flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                {evento.local}
              </h3>
              
              {evento.descricao && (
                <p className="text-zinc-400 text-sm flex items-start gap-2">
                  <AlignLeft className="h-4 w-4 shrink-0 mt-0.5 opacity-50" />
                  {evento.descricao}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    )
  }

  if (!bandaAtual) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4 pt-20">
        <CalendarDays className="h-16 w-16 opacity-20" />
        <p>Selecione ou crie uma banda para visualizar a agenda centralizada.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <CalendarDays className="text-emerald-500 h-8 w-8" />
          Agenda da Banda
        </h1>
        <p className="text-zinc-400 mt-1">
          Todos os ensaios e concertos da <strong className="text-emerald-400">{bandaAtual.nome}</strong> num só lugar.
        </p>
      </header>

      {erro && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md mb-8">
          {erro}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-emerald-500 animate-pulse">A folhear o calendário... 📅</div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-20 bg-zinc-800/30 border border-zinc-800/50 rounded-lg text-zinc-500">
          <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>O calendário está completamente vazio. Marque ensaios ou shows para preencher a agenda!</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {eventosFuturos.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold text-zinc-100">Próximos Compromissos</h2>
                <div className="h-px bg-zinc-800 flex-1"></div>
              </div>
              <div className="relative">
                {eventosFuturos.map((evento) => (
                  <EventoCard key={evento.id} evento={evento} />
                ))}
              </div>
            </section>
          )}

          {eventosPassados.length > 0 && (
            <section className="pt-8">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold text-zinc-500">Histórico de Eventos</h2>
                <div className="h-px bg-zinc-800 flex-1"></div>
              </div>
              <div className="relative">
                {eventosPassados.map((evento) => (
                  <EventoCard key={evento.id} evento={evento} passado={true} />
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  )
}