import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut } from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: ShoppingCart, label: 'Ventas (POS)', active: false },
    { icon: Package, label: 'Productos', active: false },
    { icon: Users, label: 'Clientes', active: false },
    { icon: Settings, label: 'Configuración', active: false },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
      {/* 1. Logo / Título */}
      <div className="h-20 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          POS System
        </h1>
      </div>

      {/* 2. Menú de Navegación */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${item.active 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* 3. Botón de Salir (Abajo) */}
      <div className="p-4 border-t border-slate-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};