import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useBanda } from '../contexts/BandaContext'
import { Settings, User, Users, Save, ShieldCheck, Key, X } from 'lucide-react'

export function Configuracoes() {
    const { bandaAtual, recarregarBandas } = useBanda()

    const [activeTab, setActiveTab] = useState<'perfil' | 'banda'>('perfil')
    const [nomeUsuario, setNomeUsuario] = useState('')
    const [emailUsuario, setEmailUsuario] = useState('')
    const [loadingPerfil, setLoadingPerfil] = useState(true)
    const [nomeBanda, setNomeBanda] = useState('')
    const [descricaoBanda, setDescricaoBanda] = useState('')
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
    const [salvando, setSalvando] = useState(false)
    const [mensagemSucesso, setMensagemSucesso] = useState('')
    const [erro, setErro] = useState('')

    useEffect(() => {
        async function carregarDados() {
            setMensagemSucesso('')
            setErro('')

            if (activeTab === 'perfil') {
                setLoadingPerfil(true)
                try {
                    const response = await api.get('/api/v1/usuarios/me')
                    setNomeUsuario(response.data.nome)
                    setEmailUsuario(response.data.email)
                } catch (error) {
                    console.error("Erro ao carregar perfil:", error)
                    setErro("Não foi possível carregar as informações do seu perfil.")
                } finally {
                    setLoadingPerfil(false)
                }
            } else if (activeTab === 'banda') {
                if (bandaAtual) {
                    setNomeBanda(bandaAtual.nome)
                    setDescricaoBanda(bandaAtual.descricao || '')
                }
            }
        }

        carregarDados()
    }, [activeTab, bandaAtual])

    async function handleSalvarPerfil(e: React.FormEvent) {
        e.preventDefault()
        setSalvando(true)
        setMensagemSucesso('')
        setErro('')

        try {
            await api.put('/api/v1/usuarios/me', {
                nome: nomeUsuario
            })
            setMensagemSucesso('Perfil atualizado com sucesso!')
        } catch (error: any) {
            console.error("Erro ao salvar perfil:", error)
            setErro(error.response?.data?.detail || "Falha ao atualizar o perfil.")
        } finally {
            setSalvando(false)
        }
    }

    async function handleSalvarBanda(e: React.FormEvent) {
        e.preventDefault()
        if (!bandaAtual) return

        setSalvando(true)
        setMensagemSucesso('')
        setErro('')

        try {
            await api.put(`/api/v1/bandas/${bandaAtual.id}`, {
                nome: nomeBanda,
                descricao: descricaoBanda
            })

            setMensagemSucesso('Informações da banda atualizadas com sucesso!')

            await recarregarBandas()
        } catch (error: any) {
            console.error("Erro ao salvar banda:", error)
            setErro(error.response?.data?.detail || "Falha ao atualizar a banda.")
        } finally {
            setSalvando(false)
        }
    }

    async function handleAlterarSenha(e: React.FormEvent) {
        e.preventDefault()
        setMensagemSucesso('')
        setErro('')

        if (novaSenha !== confirmarNovaSenha) {
            setErro("A nova senha e a confirmação não coincidem.")
            return
        }

        if (novaSenha.length < 6) {
            setErro("A nova senha deve ter pelo menos 6 caracteres.")
            return
        }

        setSalvando(true)
        try {
            await api.put('/api/v1/usuarios/me/senha', {
                senha_atual: senhaAtual,
                nova_senha: novaSenha
            })

            setMensagemSucesso('Senha alterada com sucesso!')
            setIsPasswordModalOpen(false)

            setSenhaAtual('')
            setNovaSenha('')
            setConfirmarNovaSenha('')
        } catch (error: any) {
            console.error("Erro ao alterar senha:", error)
            setErro(error.response?.data?.detail || "Erro ao tentar alterar a senha.")
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                    <Settings className="text-emerald-500 h-8 w-8" />
                    Configurações
                </h1>
                <p className="text-zinc-400 mt-1">
                    Gira as tuas preferências pessoais e as definições da banda.
                </p>
            </header>

            <div className="flex flex-col md:flex-row gap-8">

                <div className="w-full md:w-64 shrink-0 space-y-1">
                    <button
                        onClick={() => setActiveTab('perfil')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'perfil'
                                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                            }`}
                    >
                        <User className="h-5 w-5" />
                        O Meu Perfil
                    </button>

                    <button
                        onClick={() => setActiveTab('banda')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'banda'
                                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
                                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                            }`}
                    >
                        <Users className="h-5 w-5" />
                        Configurações da Banda
                    </button>

                    <div className="mt-8 pt-6 border-t border-zinc-800 px-4">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Segurança</h3>
                        <button
                            onClick={() => { setIsPasswordModalOpen(true); setErro(''); setMensagemSucesso(''); }}
                            className="flex items-center gap-3 text-sm text-zinc-400 hover:text-red-400 transition-colors py-2 group w-full text-left"
                        >
                            <ShieldCheck className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
                            Alterar Senha do Login
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8">

                    {mensagemSucesso && !isPasswordModalOpen && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-md mb-6 font-medium text-sm animate-in fade-in">
                            {mensagemSucesso}
                        </div>
                    )}

                    {erro && !isPasswordModalOpen && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md mb-6 font-medium text-sm animate-in fade-in">
                            {erro}
                        </div>
                    )}

                    {activeTab === 'perfil' && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-xl font-bold text-zinc-100 mb-6 border-b border-zinc-800 pb-4">
                                Informações Pessoais
                            </h2>

                            {loadingPerfil ? (
                                <div className="text-emerald-500 animate-pulse py-4">A carregar os seus dados...</div>
                            ) : (
                                <form onSubmit={handleSalvarPerfil} className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-emerald-500 border border-zinc-700 select-none">
                                            {nomeUsuario.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-zinc-200">Avatar da Conta</div>
                                            <p className="text-xs text-zinc-500 mt-1">Gerado automaticamente com base no seu nome.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-5 pt-2">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-400 mb-2">Nome Completo *</label>
                                            <input
                                                required
                                                type="text"
                                                value={nomeUsuario}
                                                onChange={(e) => setNomeUsuario(e.target.value)}
                                                className="w-full max-w-md rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-zinc-500 mb-2">E-mail de Acesso (Imutável)</label>
                                            <input
                                                type="email"
                                                value={emailUsuario}
                                                disabled
                                                className="w-full max-w-md rounded-md border border-zinc-800 bg-zinc-900/40 p-2.5 text-zinc-500 cursor-not-allowed font-mono text-sm"
                                                title="O e-mail serve como ID de segurança e não pode ser mudado."
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-800">
                                        <button type="submit" disabled={salvando} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold transition-colors disabled:opacity-50 text-sm">
                                            <Save className="h-4 w-4" />
                                            {salvando ? 'A Guardar...' : 'Guardar Alterações'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {activeTab === 'banda' && (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-xl font-bold text-zinc-100 mb-6 border-b border-zinc-800 pb-4">
                                Perfil da Banda Ativa
                            </h2>

                            {!bandaAtual ? (
                                <div className="text-zinc-500 italic py-4">
                                    Selecione uma banda no menu lateral para poder alterar as suas configurações.
                                </div>
                            ) : (
                                <form onSubmit={handleSalvarBanda} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Nome da Banda *</label>
                                        <input
                                            required
                                            type="text"
                                            value={nomeBanda}
                                            onChange={(e) => setNomeBanda(e.target.value)}
                                            className="w-full max-w-md rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Descrição / Release da Banda</label>
                                        <textarea
                                            value={descricaoBanda}
                                            onChange={(e) => setDescricaoBanda(e.target.value)}
                                            placeholder="Ex: Banda de Thrash Metal autoral formada em 2024..."
                                            className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none min-h-[120px] resize-y transition-colors placeholder:text-zinc-700"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-zinc-800">
                                        <button type="submit" disabled={salvando} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold transition-colors disabled:opacity-50 text-sm">
                                            <Save className="h-4 w-4" />
                                            {salvando ? 'A Guardar...' : 'Atualizar Banda'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative">

                        <button
                            onClick={() => setIsPasswordModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2 border-b border-zinc-800 pb-3">
                            <Key className="h-5 w-5 text-emerald-500" />
                            Segurança: Mudar Senha
                        </h2>

                        {erro && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-md mb-4 font-medium">
                                {erro}
                            </div>
                        )}

                        <form onSubmit={handleAlterarSenha} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Senha Atual *</label>
                                <input
                                    required
                                    type="password"
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div className="border-t border-zinc-800/60 my-2 pt-2">
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Nova Senha *</label>
                                <input
                                    required
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none placeholder:text-zinc-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Confirmar Nova Senha *</label>
                                <input
                                    required
                                    type="password"
                                    value={confirmarNovaSenha}
                                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                                    className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-zinc-100 focus:border-emerald-500 outline-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 rounded-md transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-md transition-colors"
                                >
                                    {salvando ? 'Processando...' : 'Alterar Senha'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    )
}