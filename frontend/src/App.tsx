import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';

import { Dashboard } from './pages/Dashboard'; 
import { Productos } from './pages/Productos';
import { Configuracion } from './pages/Configuracion';
import { Historial } from './pages/Historial';
import { Ventas } from './pages/Ventas';
import { Clientes } from './pages/Clientes';   
import { Login } from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('pos_token'));

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        
        {/* El Menú Lateral siempre visible */}
        <Sidebar />

        {/* El Área Cambiante */}
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* RUTAS DEL SISTEMA */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/ventas"    element={<Ventas />} />
            <Route path="/clientes"  element={<Clientes />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/historial" element={<Historial />} />
            
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;