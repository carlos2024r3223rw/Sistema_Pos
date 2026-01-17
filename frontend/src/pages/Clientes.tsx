import { useEffect, useState } from 'react';
import { UserPlus, Search, Phone, MapPin, Mail, User } from 'lucide-react';

interface Cliente {
  id: number;
  nombre: string;
  documento: string;
  telefono: string;
  direccion: string;
  email: string;
}

export const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '', documento: '', telefono: '', direccion: '', email: ''
  });

  // Cargar clientes
  const cargarClientes = () => {
    fetch('/api/clientes.php')
      .then(res => res.json())
      .then(data => setClientes(data));
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Guardar cliente
  const guardarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/clientes.php', {
      method: 'POST',
      body: JSON.stringify(nuevoCliente)
    });
    
    if (res.ok) {
      setMostrarModal(false);
      setNuevoCliente({ nombre: '', documento: '', telefono: '', direccion: '', email: '' });
      cargarClientes();
      alert("Cliente guardado con éxito");
    }
  };

  // Filtrar búsqueda
  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.documento?.includes(busqueda)
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cartera de Clientes</h1>
        <button 
          onClick={() => setMostrarModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
        >
          <UserPlus size={20} /> Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar por nombre o documento..." 
          className="w-full outline-none text-gray-700"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Lista de Tarjetas (Más moderno que una tabla simple) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesFiltrados.map(cliente => (
          <div key={cliente.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <User size={100} />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl">
                {cliente.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{cliente.nombre}</h3>
                <p className="text-sm text-gray-500">ID: {cliente.documento || 'S/N'}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                {cliente.telefono || 'Sin teléfono'}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                {cliente.direccion || 'Sin dirección'}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                {cliente.email || 'Sin email'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL NUEVO CLIENTE */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Registrar Cliente</h2>
            <form onSubmit={guardarCliente} className="space-y-4">
              <input required placeholder="Nombre Completo" className="w-full p-2 border rounded-lg" value={nuevoCliente.nombre} onChange={e => setNuevoCliente({...nuevoCliente, nombre: e.target.value})} />
              <input placeholder="Documento (DNI/NIT)" className="w-full p-2 border rounded-lg" value={nuevoCliente.documento} onChange={e => setNuevoCliente({...nuevoCliente, documento: e.target.value})} />
              <input placeholder="Teléfono" className="w-full p-2 border rounded-lg" value={nuevoCliente.telefono} onChange={e => setNuevoCliente({...nuevoCliente, telefono: e.target.value})} />
              <input placeholder="Dirección" className="w-full p-2 border rounded-lg" value={nuevoCliente.direccion} onChange={e => setNuevoCliente({...nuevoCliente, direccion: e.target.value})} />
              <input type="email" placeholder="Correo Electrónico" className="w-full p-2 border rounded-lg" value={nuevoCliente.email} onChange={e => setNuevoCliente({...nuevoCliente, email: e.target.value})} />
              
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};