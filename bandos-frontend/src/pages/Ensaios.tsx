import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import { Calendar, Plus, MapPin, Clock, X, AlignLeft } from 'lucide-react'

interface Ensaio {
    id: number
    data_hora: string
    local: string
    descricao: string
}

export function Ensaios() {
    const { bandaAtual } = useBanda()
    const [ensaios, setEnsaios] = useState<Ensaio[]>([])
    const [loading, setLoading] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [dataHora, setDataHora] = useState('')
    const [local, setLocal] = useState('')
    const [descricao, setDescricao] = useState('')
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarEnsaios() {
            if (!bandaAtual) return

            setLoading(true)
            setErro('')
            try {
                const response = await api.get(`/api/v1/bandas/${bandaAtual.id}/ensaios`)

                const ensaiosOrdenados = response.data.sort((a: Ensaio, b: Ensaio) =>
                    new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
                )

                setEnsaios(ensaiosOrdenados)
            } catch (error) {
                console.error("Erro ao carregar ensaios:", error)
                setErro("Não foi possível carregar a agenda de ensaios.")
            } finally {
                setLoading(false)
            }
        }

        carregarEnsaios()
    }, [bandaAtual])

    async function handleAgendarEnsaio(e: React.FormEvent) {
        e.preventDefault()
        if (!bandaAtual) return

        setSalvando(true)
        setErro('')
        try {
            await api.post(`/api/v1/bandas/${bandaAtual.id}/ensaios`, {
                data_hora: dataHora,
                local,
                descricao
            })

            setDataHora('')
            setLocal('')
            setDescricao('')
            setIsModalOpen(false)

            const response = await api.get(`/api/v1/bandas/${bandaAtual.id}/ensaios`)
            setEnsaios(response.data.sort((a: Ensaio, b: Ensaio) =>
                new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
            ))
        } catch (error: any) {
            console.error("Erro ao agendar ensaio:", error)
            setErro(error.response?.data?.detail || "Erro ao agendar o ensaio. Verifique os dados.")
        } finally {
            setSalvando(false)
        }
    }

    if (!bandaAtual) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4 pt-20">
                <Calendar className="h-16 w-16 opacity-20" />
                <p>Selecione ou crie uma banda para gerir os ensaios.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                        <Calendar className="text-emerald-500 h-8 w-8" />
                        Ensaios
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        Agenda e programação da <strong className="text-emerald-400">{bandaAtual.nome}</strong>
                    </p>
                </div>

                <button
                    onClick={() => { setIsModalOpen(true); setErro(''); }}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md font-semibold transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Agendar Ensaio
                </button>
            </header>

            {erro && !isModalOpen && (
                <div className="bg-red-500/20 text-red-400 p-4 rounded-md mb-6 border border-red-500/30">
                    {erro}
                </div>
            )}

            {loading ? (
                <div className="text-center py-20 text-emerald-500 animate-pulse">A procurar agenda... 📅</div>
            ) : ensaios.length === 0 ? (
                <div className="text-center py-20 bg-zinc-800/30 border border-zinc-800/50 rounded-lg text-zinc-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhum ensaio agendado. Bora marcar um som?</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {ensaios.map(ensaio => (
                        <div key={ensaio.id} className="bg-zinc-800 border border-zinc-700 hover:border-emerald-500/50 p-5 rounded-lg flex flex-col md:flex-row md:items-center gap-4 transition-colors">

                            <div className="bg-zinc-900/50 border border-zinc-700/50 p-3 rounded-md min-w-[200px] text-center shrink-0">
                                <span className="block text-emerald-500 font-bold capitalize text-sm mb-1">
                                    {new Date(ensaio.data_hora).toLocaleDateString('pt-BR', { weekday: 'short' })}
                                </span>
                                <span className="block text-2xl font-black text-zinc-100">
                                    {new Date(ensaio.data_hora).getDate()} {new Date(ensaio.data_hora).toLocaleDateString('pt-BR', { month: 'short' })}
                                </span>
                                <span className="flex items-center justify-center gap-1 text-zinc-400 text-xs mt-1 font-mono">
                                    <Clock className="h-3 w-3" />
                                    {new Date(ensaio.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-zinc-100 text-lg flex items-center gap-2 mb-2">
                                    <MapPin className="h-4 w-4 text-emerald-500" />
                                    {ensaio.local}
                                </h3>
                                {ensaio.descricao && (
                                    <p className="text-zinc-400 text-sm flex items-start gap-2">
                                        <AlignLeft className="h-4 w-4 shrink-0 mt-0.5" />
                                        {ensaio.descricao}
                                    </p>
                                )}
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
                            <Calendar className="h-5 w-5" />
                            Marcar Ensaio
                        </h2>

                        {erro && (
                            <div className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4 border border-red-500/30">
                                {erro}
                            </div>
                        )}

                        <form onSubmit={handleAgendarEnsaio} className="space-y-4">
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
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Local *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ex: Estúdio 2, Garagem do João..."
                                    value={local}
                                    onChange={(e) => setLocal(e.target.value)}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição / Pauta</label>
                                <textarea
                                    placeholder="O que vamos focar neste ensaio?"
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
                                    {salvando ? 'A Agendar...' : 'Agendar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}