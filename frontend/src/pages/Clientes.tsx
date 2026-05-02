import { useEffect, useState } from 'react';
import { UserPlus, Search, Phone, MapPin, Mail, User, Edit, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';

interface Cliente {
  id?: number;
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
  const [editando, setEditando] = useState<number | null>(null);
  
  const [formCliente, setFormCliente] = useState<Cliente>({
    nombre: '', documento: '', telefono: '', direccion: '', email: ''
  });

  // Notificación Toast
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  // Cargar clientes
  const cargarClientes = async () => {
    try {
      const res = await fetch('/api/clientes.php');
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setEditando(null);
    setFormCliente({ nombre: '', documento: '', telefono: '', direccion: '', email: '' });
    setMostrarModal(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (cliente: Cliente) => {
    setEditando(cliente.id || null);
    setFormCliente({ ...cliente });
    setMostrarModal(true);
  };

  // Guardar o Actualizar cliente
  const guardarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = '/api/clientes.php';
    const method = editando ? 'PUT' : 'POST';
    const body = editando ? { ...formCliente, id: editando } : formCliente;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        setMostrarModal(false);
        cargarClientes();
        Toast.fire({
          icon: 'success',
          title: editando ? 'Cliente actualizado' : 'Cliente registrado'
        });
      } else {
        Swal.fire('Error', 'No se pudo guardar el cliente', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error en la conexión', 'error');
    }
  };

  // Eliminar cliente
  const eliminarCliente = (id: number, nombre: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar al cliente "${nombre}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/clientes.php?id=${id}`, { method: 'DELETE' });
          if (res.ok) {
            cargarClientes();
            Swal.fire('Eliminado', 'El cliente ha sido eliminado.', 'success');
          } else {
            Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Error de conexión.', 'error');
        }
      }
    });
  };

  // Filtrar búsqueda
  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.documento?.includes(busqueda)
  );

  return (
    <div className="animate-fade-in p-2">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Cartera de Clientes</h1>
            <p className="text-gray-500">Gestiona la información de tus clientes habituales</p>
        </div>
        <button 
          onClick={abrirModalCrear}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-200 active:scale-95"
        >
          <UserPlus size={20} /> Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o documento..." 
          className="w-full outline-none text-gray-700 font-medium"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Lista de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesFiltrados.length === 0 && (
            <div className="col-span-full text-center py-20 opacity-40">
                <User size={80} className="mx-auto mb-4" />
                <p className="text-xl font-bold">No se encontraron clientes</p>
            </div>
        )}

        {clientesFiltrados.map(cliente => (
          <div key={cliente.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <User size={120} />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 font-black text-2xl shadow-inner">
                {cliente.nombre.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{cliente.nombre}</h3>
                <p className="text-xs font-bold text-purple-500 uppercase tracking-widest">{cliente.documento || 'Sin documento'}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                <Phone size={16} className="text-purple-400" />
                <span className="font-medium">{cliente.telefono || 'Sin teléfono'}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                <MapPin size={16} className="text-purple-400" />
                <span className="font-medium line-clamp-1">{cliente.direccion || 'Sin dirección'}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                <Mail size={16} className="text-purple-400" />
                <span className="font-medium line-clamp-1">{cliente.email || 'Sin email'}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button 
                    onClick={() => abrirModalEditar(cliente)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                >
                    <Edit size={16} /> Editar
                </button>
                <button 
                    onClick={() => eliminarCliente(cliente.id!, cliente.nombre)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                >
                    <Trash2 size={16} /> Eliminar
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CLIENTE */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-purple-600 p-6 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    {editando ? <Edit size={24} /> : <UserPlus size={24} />}
                    {editando ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <button onClick={() => setMostrarModal(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={guardarCliente} className="p-6 space-y-4">
              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nombre Completo</label>
                  <input required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none transition-all" value={formCliente.nombre} onChange={e => setFormCliente({...formCliente, nombre: e.target.value})} />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Documento (DNI/NIT)</label>
                  <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none transition-all" value={formCliente.documento} onChange={e => setFormCliente({...formCliente, documento: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Teléfono</label>
                    <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none transition-all" value={formCliente.telefono} onChange={e => setFormCliente({...formCliente, telefono: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                    <input type="email" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none transition-all" value={formCliente.email} onChange={e => setFormCliente({...formCliente, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Dirección</label>
                  <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none transition-all" value={formCliente.direccion} onChange={e => setFormCliente({...formCliente, direccion: e.target.value})} />
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all active:scale-95">
                    {editando ? 'Guardar Cambios' : 'Registrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};