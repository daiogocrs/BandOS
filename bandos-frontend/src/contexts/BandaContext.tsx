import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'
import { useAuth } from './AuthContext'

interface Banda {
  id: number
  nome: string
}

interface BandaContextType {
  bandas: Banda[]
  bandaAtual: Banda | null
  selecionarBanda: (id: number) => void
  recarregarBandas: () => Promise<void>
}

const BandaContext = createContext<BandaContextType | undefined>(undefined)

export function BandaProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [bandas, setBandas] = useState<Banda[]>([])
  const [bandaAtual, setBandaAtual] = useState<Banda | null>(null)

  const recarregarBandas = async () => {
    if (!isAuthenticated) {
      setBandas([])
      setBandaAtual(null)
      return
    }

    try {
      const response = await api.get("/api/v1/bandas")

      const lista = response.data

      setBandas(lista)

      if (lista.length > 0) {
        setBandaAtual(lista[0])
      } else {
        setBandaAtual(null)
      }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    recarregarBandas()
  }, [isAuthenticated])

  const selecionarBanda = (id: number) => {
    const banda = bandas.find(b => b.id === id)
    if (banda) {
      setBandaAtual(banda)
    }
  }

  return (
    <BandaContext.Provider value={{ bandas, bandaAtual, selecionarBanda, recarregarBandas }}>
      {children}
    </BandaContext.Provider>
  )
}

export function useBanda() {
  const context = useContext(BandaContext)
  if (!context) {
    throw new Error('useBanda deve ser usado dentro de um BandaProvider')
  }
  return context
}