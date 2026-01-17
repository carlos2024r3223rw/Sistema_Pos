import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Settings, Package, History, LogOut } from 'lucide-react';

export const Sidebar = () => {
  // Clase base para los links (para no repetir código)
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col shrink-0 transition-all duration-300">
      
      {/* LOGO */}
      <div className="p-6 mb-4">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
          POS System
        </h1>
        <p className="text-xs text-slate-500 mt-1">Gestión de Ventas v1.0</p>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        
        <p className="text-xs font-bold text-slate-600 px-4 mb-2 uppercase tracking-wider">Principal</p>
        
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/productos" className={linkClass}>
          <Package size={20} />
          <span>Productos</span>
        </NavLink>

        <NavLink to="/ventas" className={linkClass}>
          <ShoppingCart size={20} />
          <span>Ventas (POS)</span>
        </NavLink>

        <p className="text-xs font-bold text-slate-600 px-4 mt-6 mb-2 uppercase tracking-wider">Administración</p>

        <NavLink to="/clientes" className={linkClass}>
          <Users size={20} />
          <span>Clientes</span>
        </NavLink>

        {/* --- AQUÍ AGREGAMOS EL HISTORIAL --- */}
        <NavLink to="/historial" className={linkClass}>
          <History size={20} />
          <span>Historial</span>
        </NavLink>
        {/* ---------------------------------- */}

        <NavLink to="/configuracion" className={linkClass}>
          <Settings size={20} />
          <span>Configuración</span>
        </NavLink>

      </nav>

      {/* FOOTER / CERRAR SESIÓN */}
      <div className="p-4 border-t border-slate-800 mt-auto">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors w-full rounded-xl hover:bg-slate-800/50">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};