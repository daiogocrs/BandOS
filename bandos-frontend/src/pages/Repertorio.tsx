import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import { Music, Plus, Search, X, Mic2 } from 'lucide-react'

interface Musica {
    id: number
    nome: string
    artista?: string
    tom?: string
    bpm?: number
    duracao?: number
    banda_id: number
}

export function Repertorio() {
    const { bandaAtual } = useBanda()
    const [musicas, setMusicas] = useState<Musica[]>([])
    const [loading, setLoading] = useState(false)
    const [busca, setBusca] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [nome, setNome] = useState('')
    const [artista, setArtista] = useState('')
    const [tom, setTom] = useState('')
    const [bpm, setBpm] = useState('')
    const [duracao, setDuracao] = useState('')
    const [salvando, setSalvando] = useState(false)

    async function carregarMusicas() {
        if (!bandaAtual) return

        setLoading(true)

        try {
            const response = await api.get(
                `/api/v1/bandas/${bandaAtual.id}/musicas`
            )

            setMusicas(response.data)
        } catch (error) {
            console.error('Erro ao carregar músicas:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        carregarMusicas()
    }, [bandaAtual])

    function converterDuracaoParaSegundos(valor: string): number | null {
        if (!valor) return null

        const partes = valor.split(':')

        if (partes.length !== 2) return null

        const minutos = Number(partes[0])
        const segundos = Number(partes[1])

        if (
            isNaN(minutos) ||
            isNaN(segundos) ||
            segundos > 59 ||
            segundos < 0
        ) {
            return null
        }

        return minutos * 60 + segundos
    }

    function formatarDuracao(segundos?: number) {
        if (!segundos) return '--:--'

        const minutos = Math.floor(segundos / 60)
        const resto = segundos % 60

        return `${String(minutos).padStart(2, '0')}:${String(resto).padStart(2, '0')}`
    }

    async function handleAdicionarMusica(e: React.FormEvent) {
        e.preventDefault()
        if (!bandaAtual) return

        setSalvando(true)
        try {
            await api.post(
                `/api/v1/bandas/${bandaAtual.id}/musicas`,
                {
                    nome,
                    artista,
                    tom,
                    bpm: bpm ? Number(bpm) : null,
                    duracao: converterDuracaoParaSegundos(duracao)
                }
            )

            setNome('')
            setArtista('')
            setTom('')
            setBpm('')
            setDuracao('')
            setIsModalOpen(false)

            await carregarMusicas()

        } catch (error) {
            console.error("Erro ao adicionar música:", error)
            alert("Erro ao adicionar a música.")
        } finally {
            setSalvando(false)
        }
    }

    const musicasFiltradas = musicas.filter(m =>
        m.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (m.artista ?? '')
            .toLowerCase()
            .includes(busca.toLowerCase())
    )

    if (!bandaAtual) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4 pt-20">
                <Mic2 className="h-16 w-16 opacity-20" />
                <p>Selecione ou crie uma banda no menu lateral para aceder ao repertório.</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                        <Music className="text-emerald-500 h-8 w-8" />
                        Repertório
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        Gerindo as músicas da banda <strong className="text-emerald-400">{bandaAtual.nome}</strong>
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md font-semibold transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Adicionar Música
                </button>
            </header>

            <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-4 mb-6 flex items-center gap-3">
                <Search className="text-zinc-500 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Pesquisar por título ou artista..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="bg-transparent border-none text-zinc-100 focus:outline-none w-full placeholder:text-zinc-600"
                />
            </div>

            {loading ? (
                <div className="text-center py-20 text-emerald-500 animate-pulse">A afinar as guitarras... 🎸</div>
            ) : musicasFiltradas.length === 0 ? (
                <div className="text-center py-20 bg-zinc-800/30 border border-zinc-800/50 rounded-lg text-zinc-500">
                    <Music className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhuma música encontrada neste repertório.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {musicasFiltradas.map(musica => (
                        <div key={musica.id} className="bg-zinc-800 border border-zinc-700 hover:border-emerald-500/50 p-4 rounded-lg flex justify-between items-center transition-colors group">
                            <div>
                                <h3 className="font-bold text-zinc-100 text-lg">{musica.nome}</h3>
                                <p className="text-zinc-400 text-sm">{musica.artista}</p>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                {musica.tom && (
                                    <span className="bg-zinc-900 border border-zinc-700 text-emerald-400 px-3 py-1 rounded-md text-sm font-bold">
                                        {musica.tom}
                                    </span>
                                )}
                                <div className="text-right space-y-1">
                                    {musica.bpm && (
                                        <div className="text-zinc-500 text-xs font-mono">
                                            {musica.bpm} BPM
                                        </div>
                                    )}

                                    {musica.duracao && (
                                        <div className="text-zinc-400 text-xs">
                                            ⏱ {formatarDuracao(musica.duracao)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md p-6 shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100">
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
                            <Music className="h-5 w-5" />
                            Nova Música
                        </h2>

                        <form onSubmit={handleAdicionarMusica} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Título *</label>
                                <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Artista Original *</label>
                                <input required type="text" value={artista} onChange={(e) => setArtista(e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-3">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Tom</label>
                                    <input type="text" placeholder="C, Am, G" value={tom} onChange={(e) => setTom(e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none" />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">BPM</label>
                                    <input type="number" placeholder="120" value={bpm} onChange={(e) => setBpm(e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                                        Duração
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="03:45"
                                        value={duracao}
                                        onChange={(e) => setDuracao(e.target.value)}
                                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md font-medium text-zinc-300 hover:bg-zinc-800">Cancelar</button>
                                <button type="submit" disabled={salvando} className="px-4 py-2 rounded-md font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50">
                                    {salvando ? 'A Salvar...' : 'Salvar Música'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}