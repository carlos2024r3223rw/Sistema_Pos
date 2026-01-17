import { useEffect, useState } from 'react';
import { DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    ventas_hoy: 0,
    productos_activos: 0,
    alertas_stock: 0
  });

  useEffect(() => {
    fetch('/api/dashboard_stats.php')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard-container animate-fade-in">
      {/* --- ESTILOS CSS MANUALES --- */}
      <style>{`
        /* Animaciones */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }

        /* Contenedor */
        .dashboard-container { padding: 0.5rem; font-family: 'Inter', system-ui, sans-serif; }
        
        /* Títulos */
        .page-title { font-size: 1.875rem; font-weight: 800; color: #1f2937; margin-bottom: 2rem; letter-spacing: -0.025em; }

        /* Grid de Tarjetas */
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 1.5rem; 
          margin-bottom: 2rem;
        }

        /* Estilo de Tarjetas */
        .stat-card {
          background-color: #ffffff;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .cursor-pointer { cursor: pointer; }

        /* Contenido de Tarjeta */
        .stat-info h3 { font-size: 0.875rem; font-weight: 600; color: #6b7280; margin: 0 0 0.5rem 0; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-value { font-size: 2.25rem; font-weight: 800; margin: 0; line-height: 1; }

        /* Colores de Texto */
        .text-blue { color: #2563eb; }
        .text-purple { color: #9333ea; }
        .text-green { color: #16a34a; }
        .text-red { color: #dc2626; }

        /* Iconos */
        .icon-box { width: 3.5rem; height: 3.5rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
        .bg-blue-light { background-color: #eff6ff; color: #2563eb; }
        .bg-purple-light { background-color: #f3e8ff; color: #9333ea; }
        .bg-green-light { background-color: #dcfce7; color: #16a34a; }
        .bg-red-light { background-color: #fee2e2; color: #dc2626; }

        /* Banner Inferior */
        .welcome-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 1rem;
          padding: 2rem;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }
        .banner-content { position: relative; z-index: 10; }
        .banner-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem 0; }
        .banner-text { color: #94a3b8; margin: 0; font-size: 1rem; }
        .banner-icon { color: #334155; opacity: 0.5; position: absolute; right: 2rem; }
      `}</style>

      <h1 className="page-title">Resumen del Negocio</h1>
      
      <div className="stats-grid">
        
        {/* TARJETA 1: VENTAS */}
        <div className="stat-card">
          <div className="stat-info">
            <h3>Ventas de Hoy</h3>
            <p className="stat-value text-blue">
              ${Number(stats.ventas_hoy).toFixed(2)}
            </p>
          </div>
          <div className="icon-box bg-blue-light">
            <DollarSign size={32} />
          </div>
        </div>

        {/* TARJETA 2: PRODUCTOS */}
        <div 
          className="stat-card cursor-pointer"
          onClick={() => navigate('/productos')}
        >
          <div className="stat-info">
            <h3>Productos Activos</h3>
            <p className="stat-value text-purple">
              {stats.productos_activos}
            </p>
          </div>
          <div className="icon-box bg-purple-light">
            <Package size={32} />
          </div>
        </div>

        {/* TARJETA 3: ALERTAS (Con redirección) */}
        <div 
          className="stat-card cursor-pointer" 
          onClick={() => navigate('/productos')}
          style={{ borderColor: stats.alertas_stock > 0 ? '#fecaca' : '#e5e7eb' }}
        >
          <div className="stat-info">
            <h3>Alertas de Stock</h3>
            <p className={`stat-value ${stats.alertas_stock > 0 ? 'text-red' : 'text-green'}`}>
              {stats.alertas_stock}
            </p>
          </div>
          <div className={`icon-box ${stats.alertas_stock > 0 ? 'bg-red-light' : 'bg-green-light'}`}>
            <AlertTriangle size={32} />
          </div>
        </div>
      </div>

      {/* Banner decorativo */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h2 className="banner-title">¡Todo listo para vender! </h2>
          <p className="banner-text">Tu sistema está conectado y registrando datos en tiempo real.</p>
        </div>
        <div className="banner-icon">
          <TrendingUp size={80} />
        </div>
      </div>
    </div>
  );
};