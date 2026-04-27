import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import StockDetails from './pages/StockDetails'
import WealthManager from './pages/WealthManager'

import SecurityGateway from './components/auth/SecurityGateway'

function ProtectedLayout() {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // AppProvider gets a unique key and storageKey based on user.id
  // This ensures a full remount and proper data isolation between accounts
  return (
    <AppProvider key={user.id} storageKey={`nepse_v2_${user.id}`}>
      <SecurityGateway />
      <Outlet />
    </AppProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedLayout />}>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/stock/:symbol" element={<StockDetails />} />
            <Route path="/wealth-manager" element={<WealthManager />} />
          </Route>
          
          <Route path="*"         element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App