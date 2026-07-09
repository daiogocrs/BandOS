import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import {
  Calendar,
  Music,
  Users,
  Mic2,
  Guitar,
  MapPin,
} from 'lucide-react'

interface Usuario {
  nome: string
}

interface Musica {
  id: number
}

interface Integrante {
  id: number
}

interface Ensaio {
  id: number
  data_hora: string
  local: string
}

interface Show {
  id: number
  data_hora: string
  local: string
}

export function Dashboard() {
  const { bandaAtual } = useBanda()

  const [usuario, setUsuario] = useState<Usuario | null>(null)

  const [musicas, setMusicas] = useState<Musica[]>([])
  const [integrantes, setIntegrantes] = useState<Integrante[]>([])
  const [ensaios, setEnsaios] = useState<Ensaio[]>([])
  const [shows, setShows] = useState<Show[]>([])

  useEffect(() => {
    async function carregar() {
      try {
        const me = await api.get('/api/v1/usuarios/me')
        setUsuario(me.data)

        if (!bandaAtual) return

        const [
          musicasResp,
          integrantesResp,
          ensaiosResp,
          showsResp
        ] = await Promise.all([
          api.get(`/api/v1/bandas/${bandaAtual.id}/musicas`),
          api.get(`/api/v1/bandas/${bandaAtual.id}/integrantes`),
          api.get(`/api/v1/bandas/${bandaAtual.id}/ensaios`),
          api.get(`/api/v1/shows/${bandaAtual.id}`)
        ])

        setMusicas(musicasResp.data)
        setIntegrantes(integrantesResp.data)

        const ens = ensaiosResp.data.sort(
          (a: Ensaio, b: Ensaio) =>
            new Date(a.data_hora).getTime() -
            new Date(b.data_hora).getTime()
        )

        setEnsaios(ens)

        const sh = showsResp.data.sort(
          (a: Show, b: Show) =>
            new Date(a.data_hora).getTime() -
            new Date(b.data_hora).getTime()
        )

        setShows(sh)
      } catch (err) {
        console.error(err)
      }
    }

    carregar()
  }, [bandaAtual])

  const proximoEnsaio = ensaios[0]
  const proximoShow = shows[0]

  return (
    <div className="max-w-6xl mx-auto">

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">
          Olá, {usuario?.nome}! 👋
        </h1>

        <p className="text-zinc-400">
          Bem-vindo ao BandOS.
        </p>
      </header>

      <div className="grid md:grid-cols-4 gap-5 mb-8">

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <Music className="text-emerald-500 mb-3" />

          <h3 className="text-zinc-400">
            Músicas
          </h3>

          <p className="text-4xl font-bold text-white">
            {musicas.length}
          </p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <Users className="text-emerald-500 mb-3" />

          <h3 className="text-zinc-400">
            Integrantes
          </h3>

          <p className="text-4xl font-bold text-white">
            {integrantes.length}
          </p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <Calendar className="text-emerald-500 mb-3" />

          <h3 className="text-zinc-400">
            Ensaios
          </h3>

          <p className="text-4xl font-bold text-white">
            {ensaios.length}
          </p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <Guitar className="text-emerald-500 mb-3" />

          <h3 className="text-zinc-400">
            Shows
          </h3>

          <p className="text-4xl font-bold text-white">
            {shows.length}
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">

          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-emerald-500" />
            <h2 className="text-xl font-bold text-white">
              Próximo Ensaio
            </h2>
          </div>

          {proximoEnsaio ? (
            <>
              <p className="text-emerald-400 font-semibold">
                {new Date(proximoEnsaio.data_hora).toLocaleDateString('pt-BR')}
              </p>

              <p className="text-zinc-300 mt-2 flex items-center gap-2">
                <MapPin size={16} />
                {proximoEnsaio.local}
              </p>
            </>
          ) : (
            <p className="text-zinc-500">
              Nenhum ensaio agendado.
            </p>
          )}
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">

          <div className="flex items-center gap-2 mb-4">
            <Mic2 className="text-emerald-500" />
            <h2 className="text-xl font-bold text-white">
              Próximo Show
            </h2>
          </div>

          {proximoShow ? (
            <>
              <p className="text-emerald-400 font-semibold">
                {new Date(proximoShow.data_hora).toLocaleDateString('pt-BR')}
              </p>

              <p className="text-zinc-300 mt-2 flex items-center gap-2">
                <MapPin size={16} />
                {proximoShow.local}
              </p>
            </>
          ) : (
            <p className="text-zinc-500">
              Nenhum show agendado.
            </p>
          )}
        </div>

      </div>

    </div>
  )
}