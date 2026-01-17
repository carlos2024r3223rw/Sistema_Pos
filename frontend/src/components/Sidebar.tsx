import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Settings, Package, History, LogOut } from 'lucide-react';

export const Sidebar = () => {
  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
    window.location.href = '/';
  };

  return (
    <>
      {/* --- ESTILOS CSS MANUALES (Incluye arreglo de estructura) --- */}
      <style>{`
        /* 1. PARCHE PARA APP.TSX (Arregla que el Sidebar se ponga a la izquierda) */
        .flex { display: flex; }
        .h-screen { height: 100vh; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .flex-1 { flex: 1; }
        .overflow-y-auto { overflow-y: auto; }
        .p-8 { padding: 2rem; }

        /* 2. Estilos del Sidebar */
        .sidebar-container {
          width: 16rem; 
          background-color: #0f172a; 
          color: white;
          height: 100vh;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          font-family: system-ui, -apple-system, sans-serif;
          border-right: 1px solid #1e293b;
        }

        /* Logo */
        .logo-area { padding: 1.5rem; margin-bottom: 1rem; }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(to right, #60a5fa, #a855f7);
          -webkit-background-clip: text;
          color: transparent;
          margin: 0;
        }
        .logo-sub { font-size: 0.75rem; color: #64748b; margin-top: 0.25rem; }

        /* Navegación */
        .nav-area {
          flex: 1;
          padding: 0 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .nav-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          padding: 0 1rem;
          margin-bottom: 0.5rem;
          margin-top: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .nav-section-title.first { margin-top: 0; }

        /* Links */
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          transition: all 0.2s;
          font-weight: 500;
          text-decoration: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .sidebar-link:hover {
          background-color: #1e293b;
          color: white;
          transform: translateX(4px);
        }

        .sidebar-link.active {
          background-color: #2563eb;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          transform: translateX(4px);
        }

        /* Footer */
        .footer-area {
          padding: 1rem;
          border-top: 1px solid #1e293b;
          margin-top: auto;
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #94a3b8;
          background: transparent;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }
        .logout-btn:hover {
          color: #f87171;
          background-color: rgba(30, 41, 59, 0.5);
        }
      `}</style>

      <aside className="sidebar-container">
        <div className="logo-area">
          <h1 className="logo-text">POS System</h1>
          <p className="logo-sub">Gestión de Ventas v1.0</p>
        </div>

        <nav className="nav-area">
          <p className="nav-section-title first">Principal</p>
          
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/productos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Package size={20} />
            <span>Productos</span>
          </NavLink>

          <NavLink to="/ventas" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            <span>Ventas (POS)</span>
          </NavLink>

          <p className="nav-section-title">Administración</p>

          <NavLink to="/clientes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Clientes</span>
          </NavLink>

          <NavLink to="/historial" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <History size={20} />
            <span>Historial</span>
          </NavLink>

          <NavLink to="/configuracion" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Configuración</span>
          </NavLink>
        </nav>

        <div className="footer-area">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};