import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Plus, Users, Guitar, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBanda } from '../contexts/BandaContext'

interface Banda {
    id: number
    nome: string
    descricao: string
}

export function Bandas() {
    const navigate = useNavigate()
    const { selecionarBanda, recarregarBandas } = useBanda()
    const [bandas, setBandas] = useState<Banda[]>([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [criando, setCriando] = useState(false)

    async function carregarBandas() {
        try {
            setLoading(true)
            const response = await api.get('/api/v1/bandas/')
            setBandas(response.data)
            setErro('')
        } catch (error) {
            console.error("Erro ao buscar bandas:", error)
            setErro('Não foi possível carregar as tuas bandas.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        carregarBandas()
    }, [])

    async function handleCriarBanda(e: React.FormEvent) {
        e.preventDefault()
        setCriando(true)
        try {
            await api.post('/api/v1/bandas/', { nome, descricao })
            setNome('')
            setDescricao('')
            setIsModalOpen(false)
            carregarBandas()
            recarregarBandas()
        } catch (error) {
            console.error("Erro ao criar banda:", error)
            alert("Erro ao criar a banda. Verifica os dados.")
        } finally {
            setCriando(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-2">
                        <Users className="text-emerald-500" />
                        Minhas Bandas
                    </h1>
                    <p className="text-zinc-400">Gere os teus projetos musicais ou cria um novo.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md font-semibold transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Nova Banda
                </button>
            </header>

            {erro && (
                <div className="bg-red-500/20 text-red-400 p-4 rounded-md mb-6">
                    {erro}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20 text-emerald-500 animate-pulse">
                    A carregar as tuas bandas... 🎸
                </div>
            ) : bandas.length === 0 ? (
                <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-12 flex flex-col items-center text-center">
                    <div className="h-16 w-16 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 mb-4">
                        <Guitar className="h-8 w-8" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-100 mb-2">Nenhuma banda encontrada</h2>
                    <p className="text-zinc-400 max-w-md mb-6">
                        Ainda não fazes parte de nenhuma banda no BandOS. Cria o teu primeiro projeto musical para começares a organizar o teu som!
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                        + Criar a minha primeira banda
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bandas.map(banda => (
                        <div key={banda.id} className="bg-zinc-800 border border-zinc-700 hover:border-emerald-500/50 transition-colors p-6 rounded-lg shadow-sm flex flex-col">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-zinc-100 mb-2 truncate" title={banda.nome}>
                                    {banda.nome}
                                </h3>
                                <p className="text-sm text-zinc-400 line-clamp-3">
                                    {banda.descricao || 'Sem descrição.'}
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-zinc-700">
                                {/* Substitua o botão estático por este: */}
                                <button
                                    onClick={() => {
                                        selecionarBanda(banda.id)
                                        navigate('/dashboard')
                                    }}
                                    className="text-emerald-500 hover:text-emerald-400 text-sm font-semibold transition-colors"
                                >
                                    Aceder ao Painel da Banda &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-2xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
                            <Guitar className="h-6 w-6" />
                            Criar Nova Banda
                        </h2>

                        <form onSubmit={handleCriarBanda} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Nome da Banda *
                                </label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="Ex: The Rolling Stones"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Descrição (Opcional)
                                </label>
                                <textarea
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all min-h-[100px] resize-none"
                                    placeholder="Um pequeno resumo sobre o projeto..."
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-md font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={criando}
                                    className="px-4 py-2 rounded-md font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {criando ? 'A criar...' : 'Criar Banda'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}