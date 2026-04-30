import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'
import StockDetails from './pages/StockDetails'
import WealthManager from './pages/WealthManager'
import AdminDashboard from './pages/AdminDashboard'

import SecurityGateway from './components/auth/SecurityGateway'

function ProtectedLayout() {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/welcome" replace />
  }
  
  return (
    <AppProvider key={user.id} storageKey={`nepse_v2_${user.id}`}>
      <Outlet />
    </AppProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/welcome"  element={<LandingPage />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedLayout />}>
              <Route path="/"         element={<Dashboard />} />
              <Route path="/stock/:symbol" element={<StockDetails />} />
              <Route path="/wealth-manager" element={<WealthManager />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            
            <Route path="*"         element={<Navigate to={document.location.pathname === '/welcome' ? '/welcome' : '/'} />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App