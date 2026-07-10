import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Music,
    Mic2,
    Music4,
    Wrench,
    CalendarDays,
    Settings,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Radio
} from 'lucide-react'

interface MenuItem {
    title: string
    to: string
    icon: React.ComponentType<{ className?: string }>
    implemented: boolean
}

const customScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700"

export function LayoutLogado() {
    const { logout } = useAuth()
    const { bandas, bandaAtual, selecionarBanda } = useBanda()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [nomeUsuario, setNomeUsuario] = useState('Perfil')
    const [proximaAtividade, setProximaAtividade] = useState<{ tipo: string, titulo: string, data: string } | null>(null)

    useEffect(() => {
        async function carregarPerfil() {
            try {
                const response = await api.get('/api/v1/usuarios/me')
                setNomeUsuario(response.data.nome)
            } catch (error) {
                console.error(error)
            }
        }
        carregarPerfil()
    }, [])

    useEffect(() => {
        async function carregarProximaAtividade() {
            if (!bandaAtual) {
                setProximaAtividade(null)
                return
            }

            try {
                const [showsRes, ensaiosRes] = await Promise.all([
                    api.get(`/api/v1/shows/${bandaAtual.id}`),
                    api.get(`/api/v1/bandas/${bandaAtual.id}/ensaios`)
                ])

                const agora = new Date().getTime()

                const showsFuturos = showsRes.data
                    .filter((s: any) => new Date(s.data_hora).getTime() >= agora)
                    .map((s: any) => ({ ...s, tipo: 'Show' }))

                const ensaiosFuturos = ensaiosRes.data
                    .filter((e: any) => new Date(e.data_hora).getTime() >= agora)
                    .map((e: any) => ({ ...e, tipo: 'Ensaio' }))

                const todasFuturas = [...showsFuturos, ...ensaiosFuturos].sort(
                    (a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime()
                )

                if (todasFuturas.length > 0) {
                    const prox = todasFuturas[0]
                    setProximaAtividade({
                        tipo: prox.tipo,
                        titulo: prox.tipo === 'Show' ? prox.local : `Ensaio: ${prox.local}`,
                        data: prox.data_hora
                    })
                } else {
                    setProximaAtividade(null)
                }
            } catch (error) {
                console.error("Erro ao buscar próxima atividade:", error)
                setProximaAtividade(null)
            }
        }

        carregarProximaAtividade()
    }, [bandaAtual])

    const menuItems: MenuItem[] = [
        { title: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, implemented: true },
        { title: 'Minhas Bandas', to: '/bandas', icon: Users, implemented: true },
        { title: 'Integrantes', to: '/integrantes', icon: UserCheck, implemented: true },
        { title: 'Repertório', to: '/repertorio', icon: Music, implemented: true },
        { title: 'Ensaios', to: '/ensaios', icon: Mic2, implemented: true },
        { title: 'Shows', to: '/shows', icon: Music4, implemented: true },
        { title: 'Equipamentos', to: '/equipamentos', icon: Wrench, implemented: true },
        { title: 'Agenda', to: '/agenda', icon: CalendarDays, implemented: true },
        { title: 'Configurações', to: '/configuracoes', icon: Settings, implemented: true },
        { title: 'Financeiro', to: '/financeiro', icon: LayoutDashboard, implemented: false },
        { title: 'Estatísticas', to: '/estatisticas', icon: LayoutDashboard, implemented: false },
    ]

    const modulosAtivos = menuItems.filter(item => item.implemented)

    const RenderMenuLinks = () => (
        <nav className="space-y-1">
            {modulosAtivos.map((item) => {
                const Icon = item.icon
                return (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${isActive
                                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                            }`
                        }
                        title={isCollapsed ? item.title : undefined}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className={`transition-opacity ${isCollapsed ? 'md:hidden opacity-0' : 'opacity-100'}`}>
                            {item.title}
                        </span>
                    </NavLink>
                )
            })}
        </nav>
    )

    return (
        <div className="flex min-h-screen bg-zinc-900 text-zinc-100 font-sans">

            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-40">
                <h1 className="text-xl font-bold text-emerald-500 flex items-center gap-2">
                    BandOS 🎸
                </h1>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900 rounded-md"
                >
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setIsMobileOpen(false)} />
            )}

            <aside className={`md:hidden fixed top-0 bottom-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800 z-50 p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <div className="shrink-0 flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-emerald-500">BandOS 🎸</h1>
                        <p className="text-xs text-zinc-500">Acelera o Som</p>
                    </div>
                    <button onClick={() => setIsMobileOpen(false)} className="text-zinc-400 hover:text-zinc-100">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className={`flex-1 overflow-y-auto overflow-x-hidden space-y-6 pr-2 -mr-2 ${customScrollbar}`}>
                    <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-md">
                        <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Banda Atual</label>
                        <select
                            value={bandaAtual?.id || ''}
                            onChange={(e) => selecionarBanda(Number(e.target.value))}
                            className="bg-transparent text-xs font-semibold w-full text-zinc-200 focus:outline-none cursor-pointer"
                        >
                            {bandas.length === 0 && (
                                <option value="" className="bg-zinc-900 text-zinc-100">Nenhuma banda</option>
                            )}
                            {bandas.map(banda => (
                                <option key={banda.id} value={banda.id} className="bg-zinc-900 text-zinc-100">
                                    {banda.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <RenderMenuLinks />
                </div>

                <div className="shrink-0 border-t border-zinc-800 pt-4 mt-4 space-y-3">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-emerald-400 font-bold border border-zinc-700">
                            {nomeUsuario.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-zinc-300">{nomeUsuario}</span>
                    </div>
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-2 rounded-md font-medium text-sm text-red-400 hover:bg-red-500/10 w-full text-left">
                        <LogOut className="h-5 w-5" /> Sair
                    </button>
                </div>
            </aside>

            <aside
                className={`hidden md:flex flex-col bg-zinc-950 border-r border-zinc-800 p-4 h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <div className="shrink-0 space-y-6 mb-6">
                    <div className="flex items-center justify-between relative min-h-[48px]">
                        <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 overflow-hidden w-0' : 'opacity-100 w-full'}`}>
                            <h1 className="text-xl font-bold text-emerald-500 whitespace-nowrap">BandOS 🎸</h1>
                            <p className="text-[11px] text-zinc-500 whitespace-nowrap">Acelera o Som</p>
                        </div>

                        {isCollapsed && (
                            <span className="text-xl font-bold text-emerald-500 mx-auto" title="BandOS">B•OS</span>
                        )}

                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="absolute -right-7 top-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 p-1 rounded-md transition-colors"
                        >
                            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </button>
                    </div>

                    <div className={`bg-zinc-900 border border-zinc-800 p-2 rounded-md transition-all duration-300 ${isCollapsed ? 'p-1 bg-transparent border-none text-center' : ''}`}>
                        {isCollapsed ? (
                            <div className="h-8 w-8 bg-zinc-900 border border-zinc-800 rounded-md flex items-center justify-center mx-auto" title="Selecionar Banda">
                                <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
                            </div>
                        ) : (
                            <>
                                <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-0.5">Banda Atual</label>
                                <select
                                    value={bandaAtual?.id || ''}
                                    onChange={(e) => selecionarBanda(Number(e.target.value))}
                                    className="bg-transparent text-xs font-semibold w-full text-zinc-200 focus:outline-none cursor-pointer"
                                >
                                    {bandas.length === 0 && (
                                        <option value="" className="bg-zinc-900 text-zinc-100">Nenhuma banda</option>
                                    )}
                                    {bandas.map(banda => (
                                        <option key={banda.id} value={banda.id} className="bg-zinc-900 text-zinc-100">
                                            {banda.nome}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>
                </div>

                <div className={`flex-1 overflow-y-auto overflow-x-hidden space-y-6 pr-2 -mr-2 ${customScrollbar}`}>

                    <div className={`bg-zinc-900/50 border border-zinc-800/60 rounded-md p-3 text-xs transition-all duration-300 ${isCollapsed ? 'hidden opacity-0' : 'opacity-100'}`}>
                        <span className="text-zinc-500 font-bold uppercase tracking-wider block text-[10px] mb-1">Próxima Atividade</span>

                        {proximaAtividade ? (
                            <>
                                <div className="text-zinc-200 font-medium truncate" title={proximaAtividade.titulo}>
                                    {proximaAtividade.tipo === 'Show' ? '🎸' : '🎙️'} {proximaAtividade.titulo}
                                </div>
                                <div className="text-emerald-500 font-semibold mt-0.5 capitalize">
                                    {new Date(proximaAtividade.data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} às {new Date(proximaAtividade.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </>
                        ) : (
                            <div className="text-zinc-500 italic mt-1">Nenhuma atividade agendada.</div>
                        )}
                    </div>

                    <RenderMenuLinks />
                </div>

                <div className="shrink-0 border-t border-zinc-800 pt-3 mt-4 space-y-2">
                    <div className={`flex items-center gap-3 px-2 py-1 rounded-md transition-colors ${isCollapsed ? 'justify-center bg-transparent' : 'bg-zinc-900/30'}`} title={nomeUsuario}>
                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-emerald-400 font-bold border border-zinc-700 shrink-0">
                            <User className="h-4 w-4" />
                        </div>
                        <span className={`text-xs font-semibold text-zinc-300 truncate transition-opacity ${isCollapsed ? 'md:hidden opacity-0' : 'opacity-100'}`}>
                            {nomeUsuario}
                        </span>
                    </div>

                    <button
                        onClick={logout}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-all`}
                        title={isCollapsed ? 'Sair' : undefined}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span className={`${isCollapsed ? 'md:hidden' : ''}`}>Sair</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-8 overflow-y-auto mt-16 md:mt-0 transition-all duration-300">
                <Outlet />
            </main>

        </div>
    )
}