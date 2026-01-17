import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* IZQUIERDA: El Menú Lateral */}
      <Sidebar />

      {/* DERECHA: El Área de Trabajo */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          
          {/* Encabezado de la sección */}
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Bienvenido, Admin</h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </header>

          {/* Aquí irán tus tablas y tarjetas más adelante */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-40 flex items-center justify-center text-gray-400">
              Resumen de Ventas
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-40 flex items-center justify-center text-gray-400">
              Productos Bajos de Stock
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-40 flex items-center justify-center text-gray-400">
              Caja Actual
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default App;