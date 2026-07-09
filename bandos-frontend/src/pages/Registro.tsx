import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'

export function Registro() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState(false)

    const navigate = useNavigate()

    const handleRegistro = async (e: React.FormEvent) => {
        e.preventDefault()
        setErro('')
        setSucesso(false)

        try {
            await api.post('/api/v1/usuarios/', {
                nome,
                email,
                senha
            })

            setSucesso(true)
            
            setTimeout(() => {
                navigate('/login')
            }, 2000)

        } catch (error) {
            console.error(error)
            setErro('Erro ao criar conta. Verifique os dados ou se o email já existe.')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
            <div className="w-full max-w-md rounded-lg bg-zinc-800 p-8 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-emerald-500">
                    Criar Conta 🎸
                </h1>

                {erro && (
                    <div className="mb-4 rounded-md bg-red-500/20 p-3 text-center text-sm text-red-400">
                        {erro}
                    </div>
                )}

                {sucesso && (
                    <div className="mb-4 rounded-md bg-emerald-500/20 p-3 text-center text-sm text-emerald-400">
                        Conta criada com sucesso! Redirecionando...
                    </div>
                )}

                <form onSubmit={handleRegistro} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-300">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Seu nome"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-300">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-300">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-emerald-600 py-2 font-semibold text-white transition-colors hover:bg-emerald-500"
                    >
                        Registrar
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-zinc-400">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="text-emerald-500 hover:underline">
                        Faça login
                    </Link>
                </div>
            </div>
        </div>
    )
}