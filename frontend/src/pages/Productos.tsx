import { useEffect, useState } from 'react';
import { Plus, X, Pencil, Image as ImageIcon, Upload, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2'; // <-- Importamos la librería de alertas

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

  const cargarProductos = () => {
    fetch('/api/productos.php')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error cargando productos:", err));
  };

  useEffect(() => {
    cargarProductos();
    const intervalo = setInterval(cargarProductos, 5000); 
    return () => clearInterval(intervalo);
  }, []);

  // --- Lógica de Filtros ---
  const productosFiltrados = productos.filter(prod => {
    const coincideTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          (prod.codigo_barras && prod.codigo_barras.includes(busqueda));
    const coincideStock = soloBajoStock ? prod.stock_actual < 5 : true;
    return coincideTexto && coincideStock;
  });

  const obtenerUrlImagen = (ruta?: string) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `/${ruta}`; // Ruta local
  };

  // --- Funciones del Modal ---
  const abrirCrear = () => {
    setEditandoId(null);
    setNombre(''); setCodigo(''); setPrecio(''); setStock('');
    setArchivoImagen(null); setPreviewImagen(null);
    setMostrarModal(true);
  };

  const abrirEditar = (prod: Producto) => {
    setEditandoId(prod.id); // Guardamos el ID que vamos a editar
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

  // --- FUNCIÓN GUARDAR (CORREGIDA Y CON SWEETALERT) ---
  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    // Confirmación previa con SweetAlert
    const confirmacion = await Swal.fire({
      title: editandoId ? '¿Guardar cambios?' : '¿Crear producto?',
      text: editandoId ? 'Se actualizará la información del producto.' : 'Se añadirá al inventario.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    // Preparamos los datos
    const formData = new FormData();
    if (editandoId) {
      formData.append('id', editandoId.toString()); // IMPORTANTE: Enviamos el ID
    }
    formData.append('nombre', nombre);
    formData.append('codigo_barras', codigo);
    formData.append('precio_venta', precio);
    formData.append('stock_actual', stock);
    if (archivoImagen) formData.append('imagen', archivoImagen);

    try {
      const response = await fetch('/api/guardar_producto.php', {
        method: 'POST',
        body: formData
      });

      const resultado = await response.json();

      if (response.ok) {
        setMostrarModal(false);
        cargarProductos(); // Recarga inmediata de la tabla
        
        // Alerta de Éxito
        Swal.fire({
          title: '¡Excelente!',
          text: editandoId ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(resultado.error || "Error desconocido");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el producto. Revisa la consola.',
        icon: 'error'
      });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventario ({productosFiltrados.length})</h1>
        <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg transition-colors">
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o código..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setSoloBajoStock(!soloBajoStock)}
          className={`px-4 py-2 rounded-lg border flex items-center gap-2 font-medium transition-colors ${soloBajoStock ? 'bg-red-50 border-red-200 text-red-600 ring-2 ring-red-500' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          <Filter size={18} /> {soloBajoStock ? 'Mostrando Bajo Stock' : 'Filtrar Bajo Stock'}
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Producto</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Precio</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productosFiltrados.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                        {prod.imagen ? <img src={obtenerUrlImagen(prod.imagen) || ''} alt={prod.nombre} className="h-full w-full object-cover" /> : <ImageIcon className="text-gray-400" size={24} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{prod.nombre}</p>
                        <p className="text-xs text-gray-400">{prod.codigo_barras}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-green-600 font-bold">${Number(prod.precio_venta).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${prod.stock_actual < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {prod.stock_actual} unid.
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => abrirEditar(prod)} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg flex items-center gap-2 hover:bg-blue-100 transition-colors">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setMostrarModal(false)}><X size={24} className="text-gray-400 hover:text-red-500" /></button>
            </div>
            
            <form onSubmit={guardarProducto} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative group cursor-pointer">
                  <div className="h-32 w-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-blue-500 transition-colors">
                    {previewImagen ? <img src={previewImagen} className="h-full w-full object-cover" /> : <div className="text-center text-gray-400"><Upload className="mx-auto mb-1" /><span className="text-xs">Subir Foto</span></div>}
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <input required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Precio ($)</label>
                  <input type="number" step="0.01" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={precio} onChange={e => setPrecio(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock</label>
                  <input type="number" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={stock} onChange={e => setStock(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Código de Barras</label>
                <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={codigo} onChange={e => setCodigo(e.target.value)} />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-transform active:scale-95 shadow-lg">
                {editandoId ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};