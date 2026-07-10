import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Registro } from './pages/Registro'
import { Dashboard } from './pages/Dashboard'
import { Bandas } from './pages/Bandas'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LayoutLogado } from './components/LayoutLogado'
import { BandaProvider } from './contexts/BandaContext'
import { Repertorio } from './pages/Repertorio' 
import { Integrantes } from './pages/Integrantes'
import { Ensaios } from './pages/Ensaios'
import { Shows } from './pages/Shows'
import { Setlist } from './pages/Setlist'
import { Equipamentos } from './pages/Equipamentos'
import { Configuracoes } from './pages/Configuracoes'
import { Agenda } from './pages/Agenda'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BandaProvider> 
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            <Route element={<ProtectedRoute><LayoutLogado /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bandas" element={<Bandas />} />
            <Route path="/repertorio" element={<Repertorio />} />
            <Route path="/integrantes" element={<Integrantes />} /> 
            <Route path="/ensaios" element={<Ensaios />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/shows/:showId/setlist" element={<Setlist />} />
            <Route path="/equipamentos" element={<Equipamentos />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>

          </Routes>
        </BandaProvider> 
      </AuthProvider>
    </BrowserRouter> 
  )
}

export default App