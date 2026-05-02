import { useEffect, useState } from 'react';
import { Plus, X, Pencil, Image as ImageIcon, Upload, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';

interface Producto {
  id: number;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
  codigo_barras: string;
  imagen?: string;
}

export const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [soloBajoStock, setSoloBajoStock] = useState(false);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);

  // Configuración de Toasts
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const cargarProductos = () => {
    fetch('/api/productos.php')
      .then(res => res.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error:", err));
  };

  useEffect(() => {
    cargarProductos();
    const intervalo = setInterval(cargarProductos, 10000); 
    return () => clearInterval(intervalo);
  }, []);

  const productosFiltrados = productos.filter(prod => {
    const coincideTexto = (prod.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) || 
                          (prod.codigo_barras && prod.codigo_barras.includes(busqueda));
    const coincideStock = soloBajoStock ? prod.stock_actual < 5 : true;
    return coincideTexto && coincideStock;
  });

  const obtenerUrlImagen = (ruta?: string) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `/${ruta}`;
  };

  const abrirCrear = () => {
    setEditandoId(null);
    setNombre(''); setCodigo(''); setPrecio(''); setStock('');
    setArchivoImagen(null); setPreviewImagen(null);
    setMostrarModal(true);
  };

  const abrirEditar = (prod: Producto) => {
    setEditandoId(prod.id);
    setNombre(prod.nombre);
    setCodigo(prod.codigo_barras || '');
    setPrecio(prod.precio_venta.toString());
    setStock(prod.stock_actual.toString());
    setPreviewImagen(obtenerUrlImagen(prod.imagen));
    setArchivoImagen(null);
    setMostrarModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivoImagen(file);
      setPreviewImagen(URL.createObjectURL(file));
    }
  };

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (editandoId) formData.append('id', editandoId.toString());
    formData.append('nombre', nombre);
    formData.append('codigo_barras', codigo);
    formData.append('precio_venta', precio);
    formData.append('stock_actual', stock);
    if (archivoImagen) formData.append('imagen', archivoImagen);

    try {
      const response = await fetch('/api/guardar_producto.php', { method: 'POST', body: formData });
      if (response.ok) {
        setMostrarModal(false);
        cargarProductos();
        Toast.fire({
            icon: 'success',
            title: editandoId ? 'Producto actualizado' : 'Producto creado'
        });
      } else {
        Swal.fire('Error', 'No se pudo guardar el producto', 'error');
      }
    } catch (error) { 
        Swal.fire('Error', 'Error de conexión', 'error');
    }
  };

  return (
    <div className="animate-fade-in p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Inventario de Productos</h1>
            <p className="text-gray-500 font-medium">Gestiona tu stock y precios ({productosFiltrados.length} items)</p>
        </div>
        <button 
            onClick={abrirCrear} 
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          <Plus size={24} /> Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 shadow-sm"
            placeholder="Buscar por nombre o código..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setSoloBajoStock(!soloBajoStock)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${soloBajoStock ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
        >
          <Filter size={18} /> {soloBajoStock ? 'Bajo Stock Activo' : 'Ver Bajo Stock'}
        </button>
      </div>

      {/* Tabla Estilizada */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Detalles del Producto</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Precio Unitario</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Disponible</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productosFiltrados.map((prod) => (
                <tr key={prod.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                        {prod.imagen ? (
                          <img src={obtenerUrlImagen(prod.imagen) || ''} alt={prod.nombre} className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon size={24} className="text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg leading-tight">{prod.nombre}</p>
                        <p className="text-xs font-black text-gray-300 mt-1 uppercase tracking-tighter">REF: {prod.codigo_barras || 'S/C'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                      <span className="text-xl font-black text-blue-600">${Number(prod.precio_venta).toFixed(2)}</span>
                  </td>
                  <td className="p-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase ${prod.stock_actual < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${prod.stock_actual < 5 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      {prod.stock_actual} Unidades
                    </div>
                  </td>
                  <td className="p-5">
                    <button 
                        onClick={() => abrirEditar(prod)} 
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                    >
                      <Pencil size={16} /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                    {editandoId ? <Pencil size={24} /> : <Plus size={24} />}
                    {editandoId ? 'Editar Producto' : 'Nuevo Registro'}
                </h2>
                <button onClick={() => setMostrarModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={guardarProducto} className="p-8">
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-gray-50 border-4 border-gray-50 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-blue-100 transition-colors">
                    {previewImagen ? (
                      <img src={previewImagen} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center text-gray-300">
                        <Upload size={32} className="mx-auto mb-1" />
                        <span className="text-[10px] font-black uppercase">Subir Foto</span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Nombre del Producto</label>
                  <input required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Precio de Venta</label>
                    <input type="number" step="0.01" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold" value={precio} onChange={e => setPrecio(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Stock Inicial</label>
                    <input type="number" required className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold" value={stock} onChange={e => setStock(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Código de Barras / SKU</label>
                  <input className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold" value={codigo} onChange={e => setCodigo(e.target.value)} />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg mt-8 shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-tight">
                {editandoId ? 'Guardar Cambios' : 'Registrar Producto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};