import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import {
    Wrench,
    Plus,
    X,
    Guitar,
    Settings2,
    Speaker
} from 'lucide-react'

interface Equipamento {
    id: number
    nome: string
    categoria: string
    marca?: string
    modelo?: string
    quantidade: number
    estado: string
}

export function Equipamentos() {
    const { bandaAtual } = useBanda()

    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [nome, setNome] = useState('')
    const [categoria, setCategoria] = useState('Instrumento de Cordas')
    const [marca, setMarca] = useState('')
    const [modelo, setModelo] = useState('')
    const [quantidade, setQuantidade] = useState(1)
    const [estado, setEstado] = useState('Bom')
    const [salvando, setSalvando] = useState(false)

    async function carregarEquipamentos() {
        if (!bandaAtual) {
            setEquipamentos([])
            return
        }

        setLoading(true)
        setErro('')

        try {
            const response = await api.get(
                `/api/v1/equipamentos/${bandaAtual.id}`
            )

            setEquipamentos(
                response.data.sort(
                    (a: Equipamento, b: Equipamento) =>
                        a.nome.localeCompare(b.nome)
                )
            )
        } catch (error) {
            console.error(error)
            setErro('Não foi possível carregar os equipamentos.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        carregarEquipamentos()
    }, [bandaAtual])

    async function handleAdicionarEquipamento(
        e: React.FormEvent
    ) {
        e.preventDefault()

        if (!bandaAtual) return

        setSalvando(true)
        setErro('')

        try {
            await api.post(
                `/api/v1/equipamentos/${bandaAtual.id}`,
                {
                    nome,
                    categoria,
                    marca,
                    modelo,
                    quantidade,
                    estado
                }
            )

            setNome('')
            setCategoria('Instrumento de Cordas')
            setMarca('')
            setModelo('')
            setQuantidade(1)
            setEstado('Bom')
            setIsModalOpen(false)

            await carregarEquipamentos()
        } catch (error: any) {
            console.error(error)
            setErro(
                error.response?.data?.detail ||
                'Erro ao guardar o equipamento.'
            )
        } finally {
            setSalvando(false)
        }
    }

    function getEstadoColor(estado: string) {
        switch (estado) {
            case 'Bom':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'

            case 'Manutenção':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'

            case 'Danificado':
                return 'bg-red-500/10 text-red-400 border-red-500/20'

            case 'Perdido':
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'

            default:
                return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
        }
    }

    function getCategoriaIcon(categoria: string) {
        const c = categoria.toLowerCase()

        if (c.includes('corda') || c.includes('instrumento')) {
            return <Guitar className="h-5 w-5 text-zinc-400" />
        }

        if (
            c.includes('áudio') ||
            c.includes('audio') ||
            c.includes('amplificador')
        ) {
            return <Speaker className="h-5 w-5 text-zinc-400" />
        }

        return <Settings2 className="h-5 w-5 text-zinc-400" />
    }

    if (!bandaAtual) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4 pt-20">
                <Wrench className="h-16 w-16 opacity-20" />
                <p>Selecione ou crie uma banda para gerir os equipamentos.</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">

            <header className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                        <Wrench className="h-8 w-8 text-emerald-500" />
                        Equipamentos
                    </h1>

                    <p className="text-zinc-400 mt-2">
                        Inventário e estado dos equipamentos da{" "}
                        <strong className="text-emerald-400">
                            {bandaAtual.nome}
                        </strong>
                    </p>
                </div>

                <button
                    onClick={() => {
                        setErro("")
                        setIsModalOpen(true)
                    }}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Adicionar Equipamento
                </button>

            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5">
                    <p className="text-zinc-400 text-sm">
                        Total de Equipamentos
                    </p>

                    <h2 className="text-3xl font-bold text-zinc-100 mt-2">
                        {equipamentos.length}
                    </h2>
                </div>

                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5">
                    <p className="text-zinc-400 text-sm">
                        Em Bom Estado
                    </p>

                    <h2 className="text-3xl font-bold text-emerald-500 mt-2">
                        {
                            equipamentos.filter(
                                equipamento => equipamento.estado === "Bom"
                            ).length
                        }
                    </h2>
                </div>

                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5">
                    <p className="text-zinc-400 text-sm">
                        Precisam de Atenção
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-500 mt-2">
                        {
                            equipamentos.filter(
                                equipamento =>
                                    equipamento.estado === "Manutenção" ||
                                    equipamento.estado === "Danificado"
                            ).length
                        }
                    </h2>
                </div>

            </div>

            {erro && !isModalOpen && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6">
                    {erro}
                </div>
            )}

            {loading ? (
                <div className="text-center py-20 text-emerald-500 animate-pulse">A carregar o inventário... 🎸</div>
            ) : equipamentos.length === 0 ? (
                <div className="text-center py-20 bg-zinc-800/30 border border-zinc-800/50 rounded-lg text-zinc-500">
                    <Wrench className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>O inventário está vazio. Adicione os seus primeiros instrumentos, cabos e pedais!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {equipamentos.map(item => (
                        <div key={item.id} className="bg-zinc-800 border border-zinc-700 hover:border-emerald-500/50 p-5 rounded-lg transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-700">
                                        {getCategoriaIcon(item.categoria)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-zinc-100 text-lg leading-tight truncate max-w-[200px]" title={item.nome}>
                                            {item.nome}
                                        </h3>
                                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{item.categoria}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4 min-h-[40px]">
                                {item.marca && (
                                    <div className="text-sm text-zinc-300 flex justify-between">
                                        <span className="text-zinc-500">Marca:</span>

                                        <span>
                                            {item.marca}
                                            {item.modelo ? ` - ${item.modelo}` : ""}
                                        </span>
                                    </div>
                                )}
                                <div className="text-sm text-zinc-300 flex justify-between">
                                    <span className="text-zinc-500">Quantidade:</span>
                                    <span className="font-mono">{item.quantidade}x</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-700 flex items-center justify-between">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getEstadoColor(item.estado)}`}>
                                    {item.estado}
                                </span>

                                <button className="text-zinc-500 hover:text-emerald-400 text-sm font-medium transition-colors">
                                    Detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md p-6 shadow-2xl relative">

                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
                            <Wrench className="h-5 w-5" />
                            Novo Equipamento
                        </h2>

                        {erro && (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-md p-3 mb-4 text-sm">
                                {erro}
                            </div>
                        )}

                        <form onSubmit={handleAdicionarEquipamento} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Nome *
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Ex: Guitarra Red Special"
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                                        Categoria *
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                        placeholder="Instrumento de Cordas"
                                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                                        Estado *
                                    </label>

                                    <select
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                                    >
                                        <option value="Bom">Bom</option>
                                        <option value="Manutenção">Manutenção</option>
                                        <option value="Danificado">Danificado</option>
                                        <option value="Perdido">Perdido</option>
                                    </select>
                                </div>

                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                                        Marca
                                    </label>

                                    <input
                                        type="text"
                                        value={marca}
                                        onChange={(e) => setMarca(e.target.value)}
                                        placeholder="Ex: Fender"
                                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                                        Modelo
                                    </label>

                                    <input
                                        type="text"
                                        value={modelo}
                                        onChange={(e) => setModelo(e.target.value)}
                                        placeholder="Ex: Stratocaster"
                                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                                    />
                                </div>

                            </div>

                            <div className="w-32">
                                <label className="block text-sm font-medium text-zinc-300 mb-1">
                                    Quantidade *
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    required
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(Number(e.target.value))}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-zinc-800 pt-5">

                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold transition-colors"
                                >
                                    {salvando ? "Guardando..." : "Guardar Equipamento"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}
        </div>
    )
}