import { useEffect, useState } from 'react';
import { Plus, X, Pencil, Image as ImageIcon, Upload, Search, Filter } from 'lucide-react';

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
      .catch(err => console.error("Error:", err));
  };

  useEffect(() => {
    cargarProductos();
    const intervalo = setInterval(cargarProductos, 5000); 
    return () => clearInterval(intervalo);
  }, []);

  const productosFiltrados = productos.filter(prod => {
    const coincideTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
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

    // Usamos confirmación nativa para evitar errores de compilación
    const mensaje = editandoId ? '¿Guardar cambios?' : '¿Crear producto?';
    if (!window.confirm(mensaje)) return;

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
        window.alert('¡Guardado exitosamente!');
      } else {
        window.alert('Error al guardar el producto');
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="page-container">
      {/* --- ESTILOS CSS INYECTADOS --- */}
      <style>{`
        .page-container { padding: 1rem; font-family: system-ui, -apple-system, sans-serif; animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Encabezado */
        .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .page-title { font-size: 1.8rem; font-weight: 800; color: #1f2937; margin: 0; }
        
        /* Botones */
        .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
        .btn-primary { background-color: #2563eb; color: white; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3); }
        .btn-primary:hover { background-color: #1d4ed8; transform: translateY(-1px); }
        .btn-secondary { background-color: white; border: 1px solid #e5e7eb; color: #374151; }
        .btn-secondary:hover { background-color: #f9fafb; }
        .btn-secondary.active { background-color: #fecaca; color: #dc2626; border-color: #fecaca; }
        
        /* Barra de Filtros */
        .filters-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .search-container { flex: 1; position: relative; }
        .search-icon { position: absolute; left: 0.75rem; top: 0.75rem; color: #9ca3af; }
        .search-input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; font-size: 0.95rem; }
        .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

        /* Tabla */
        .table-container { background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; overflow: hidden; }
        .scroll-area { max-height: 70vh; overflow-y: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        thead { background-color: #f9fafb; position: sticky; top: 0; z-index: 10; }
        th { padding: 1rem; font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; }
        td { padding: 1rem; border-bottom: 1px solid #f3f4f6; color: #374151; vertical-align: middle; }
        tr:hover { background-color: #f8fafc; }

        /* Elementos de Tabla */
        .prod-info { display: flex; align-items: center; gap: 1rem; }
        .prod-img-box { width: 3rem; height: 3rem; border-radius: 0.5rem; background: #f3f4f6; border: 1px solid #e5e7eb; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .prod-img { width: 100%; height: 100%; object-fit: cover; }
        .prod-name { font-weight: 600; color: #111827; margin: 0; }
        .prod-code { font-size: 0.75rem; color: #9ca3af; margin: 0; }
        .price-tag { color: #16a34a; font-weight: 700; font-size: 1rem; }
        
        .stock-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
        .stock-ok { background-color: #dcfce7; color: #15803d; }
        .stock-low { background-color: #fee2e2; color: #b91c1c; }

        .btn-edit { background-color: #eff6ff; color: #2563eb; padding: 0.5rem; border-radius: 0.5rem; border: none; cursor: pointer; display: flex; gap: 0.25rem; align-items: center; font-size: 0.85rem; font-weight: 500; }
        .btn-edit:hover { background-color: #dbeafe; color: #1e40af; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; animation: fadeIn 0.2s; }
        .modal-content { background: white; border-radius: 1rem; width: 100%; max-width: 28rem; padding: 1.5rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-title { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin: 0; }
        .close-btn { color: #9ca3af; background: none; border: none; cursor: pointer; }
        .close-btn:hover { color: #ef4444; }

        .form-group { margin-bottom: 1rem; }
        .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
        .form-input { width: 100%; padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; }
        .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .upload-area { display: flex; justify-content: center; margin-bottom: 1rem; }
        .upload-circle { width: 8rem; height: 8rem; border-radius: 50%; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f9fafb; position: relative; cursor: pointer; transition: border-color 0.2s; }
        .upload-circle:hover { border-color: #3b82f6; }
        .upload-preview { width: 100%; height: 100%; object-fit: cover; }
        .upload-placeholder { text-align: center; color: #9ca3af; font-size: 0.75rem; }
        .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .btn-submit { width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 700; cursor: pointer; margin-top: 1rem; }
        .btn-submit:hover { background: #1d4ed8; }
      `}</style>

      {/* Encabezado */}
      <div className="header-row">
        <h1 className="page-title">Inventario ({productosFiltrados.length})</h1>
        <button onClick={abrirCrear} className="btn btn-primary">
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-row">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input 
            className="search-input"
            placeholder="Buscar por nombre o código..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setSoloBajoStock(!soloBajoStock)}
          className={`btn btn-secondary ${soloBajoStock ? 'active' : ''}`}
        >
          <Filter size={18} /> {soloBajoStock ? 'Mostrando Bajo Stock' : 'Filtrar Bajo Stock'}
        </button>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <div className="scroll-area">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div className="prod-info">
                      <div className="prod-img-box">
                        {prod.imagen ? (
                          <img src={obtenerUrlImagen(prod.imagen) || ''} alt={prod.nombre} className="prod-img" />
                        ) : (
                          <ImageIcon size={24} color="#9ca3af" />
                        )}
                      </div>
                      <div>
                        <p className="prod-name">{prod.nombre}</p>
                        <p className="prod-code">{prod.codigo_barras}</p>
                      </div>
                    </div>
                  </td>
                  <td className="price-tag">${Number(prod.precio_venta).toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${prod.stock_actual < 5 ? 'stock-low' : 'stock-ok'}`}>
                      {prod.stock_actual} unid.
                    </span>
                  </td>
                  <td>
                    <button onClick={() => abrirEditar(prod)} className="btn-edit">
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setMostrarModal(false)} className="close-btn"><X size={24} /></button>
            </div>
            
            <form onSubmit={guardarProducto}>
              <div className="upload-area">
                <div className="upload-circle">
                  {previewImagen ? (
                    <img src={previewImagen} className="upload-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <Upload style={{margin:'0 auto 4px'}} size={24} />
                      <span>Subir Foto</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input required className="form-input" value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio ($)</label>
                  <input type="number" step="0.01" required className="form-input" value={precio} onChange={e => setPrecio(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input type="number" required className="form-input" value={stock} onChange={e => setStock(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Código de Barras</label>
                <input className="form-input" value={codigo} onChange={e => setCodigo(e.target.value)} />
              </div>

              <button type="submit" className="btn-submit">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};