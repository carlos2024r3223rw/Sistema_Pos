import { useEffect, useState } from 'react';
import { DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    ventas_hoy: 0,
    productos_activos: 0,
    alertas_stock: 0
  });

  // Cargar estadísticas reales al entrar
  useEffect(() => {
    fetch('/api/dashboard_stats.php')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resumen del Negocio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TARJETA 1: VENTAS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Ventas de Hoy</h3>
            <p className="text-4xl font-bold text-blue-600">
              ${Number(stats.ventas_hoy).toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <DollarSign size={32} />
          </div>
        </div>

        {/* TARJETA 2: PRODUCTOS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Productos en Stock</h3>
            <p className="text-4xl font-bold text-purple-600">
              {stats.productos_activos}
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full text-purple-600">
            <Package size={32} />
          </div>
        </div>

        {/* TARJETA 3: ALERTAS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Alertas de Stock</h3>
            <p className={`text-4xl font-bold ${stats.alertas_stock > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {stats.alertas_stock}
            </p>
          </div>
          <div className={`p-3 rounded-full ${stats.alertas_stock > 0 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
            <AlertTriangle size={32} />
          </div>
        </div>
      </div>

      {/* Sección decorativa de abajo */}
      <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white flex items-center justify-between shadow-xl">
        <div>
          <h2 className="text-2xl font-bold mb-2">¡Todo listo para vender! </h2>
          <p className="text-slate-400">Tu sistema está conectado y registrando datos en tiempo real.</p>
        </div>
        <TrendingUp size={64} className="text-slate-600 opacity-50" />
      </div>
    </div>
  );
};