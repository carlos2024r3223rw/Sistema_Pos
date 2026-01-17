export const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resumen del Negocio</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Ventas de Hoy</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Productos Activos</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">124</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Alertas Stock</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">5</p>
        </div>
      </div>
    </div>
  );
};