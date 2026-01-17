import { useEffect, useState } from 'react';
import { Save, Building, MapPin, Phone, Receipt, Percent } from 'lucide-react';

export const Configuracion = () => {
  const [empresa, setEmpresa] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    simbolo_moneda: '$',
    impuesto_porcentaje: 0,
    mensaje_ticket: ''
  });

  // Cargar datos al entrar
  useEffect(() => {
    fetch('/api/configuracion.php')
      .then(res => res.json())
      .then(data => {
        if(data && data.nombre) setEmpresa(data);
      });
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/configuracion.php', {
      method: 'POST',
      body: JSON.stringify(empresa)
    });
    
    if(res.ok) alert("¡Datos de la tienda actualizados! 🏪");
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Configuración del Negocio</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">Datos Generales</h2>
          <p className="text-sm text-gray-500">Esta información aparecerá en tus tickets de venta</p>
        </div>
        
        <form onSubmit={guardar} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building size={18} className="text-blue-500" /> Nombre de la Tienda
              </label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={empresa.nombre}
                onChange={e => setEmpresa({...empresa, nombre: e.target.value})}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={18} className="text-blue-500" /> Teléfono
              </label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={empresa.telefono}
                onChange={e => setEmpresa({...empresa, telefono: e.target.value})}
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin size={18} className="text-blue-500" /> Dirección
            </label>
            <input 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={empresa.direccion}
              onChange={e => setEmpresa({...empresa, direccion: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Moneda */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Receipt size={18} className="text-green-500" /> Símbolo de Moneda
              </label>
              <select 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={empresa.simbolo_moneda}
                onChange={e => setEmpresa({...empresa, simbolo_moneda: e.target.value})}
              >
                <option value="$">Dólar ($)</option>
                <option value="€">Euro (€)</option>
                <option value="Q">Quetzal (Q)</option>
                <option value="L">Lempira (L)</option>
                <option value="₡">Colón (₡)</option>
              </select>
            </div>

            {/* Impuesto */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Percent size={18} className="text-red-500" /> Impuesto (%)
              </label>
              <input 
                type="number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                value={empresa.impuesto_porcentaje}
                onChange={e => setEmpresa({...empresa, impuesto_porcentaje: Number(e.target.value)})}
              />
            </div>
          </div>

          {/* Mensaje Ticket */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje en el Ticket (Pie de página)</label>
            <textarea 
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={empresa.mensaje_ticket}
              onChange={e => setEmpresa({...empresa, mensaje_ticket: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
              <Save size={20} /> Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};