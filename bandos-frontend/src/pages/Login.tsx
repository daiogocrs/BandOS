import { useState } from 'react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [erro, setErro] = useState('')

    const navigate = useNavigate()
    const { login } = useAuth()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErro('')

        try {
            const formData = new URLSearchParams()
            formData.append('username', email)
            formData.append('password', password)

            const response = await api.post('/api/v1/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            const token = response.data.access_token
            
            login(token) 
            navigate('/dashboard')

        } catch (error) {
            console.error("Erro no login:", error)
            setErro('Credenciais inválidas. Tente novamente.')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-4">
            <div className="w-full max-w-md rounded-lg bg-zinc-800 p-8 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-emerald-500">
                    BandOS 🎸
                </h1>

                {erro && (
                    <div className="mb-4 rounded-md bg-red-500/20 p-3 text-center text-sm text-red-400">
                        {erro}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-emerald-600 py-2 font-semibold text-white transition-colors hover:bg-emerald-500"
                    >
                        Entrar
                    </button>

                </form>

                <div className="mt-4 text-center text-sm text-zinc-400">
                    Ainda não tem uma banda?{' '}
                    <Link to="/registro" className="text-emerald-500 hover:underline">
                        Crie sua conta
                    </Link>
                </div>
            </div>
        </div>
    )
}