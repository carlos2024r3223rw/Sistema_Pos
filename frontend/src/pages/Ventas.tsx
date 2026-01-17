import { useEffect, useState } from 'react';
import { Search, Trash2, ShoppingCart, Calculator } from 'lucide-react';
import Swal from 'sweetalert2';

interface Producto {
  id: number;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
  imagen?: string;
}

interface ItemCarrito extends Producto {
  cantidad: number;
}

export const Ventas = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch('/api/productos.php').then(res => res.json()).then(data => setProductos(data));
  }, []);

  const agregarAlCarrito = (producto: Producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map(item => item.id === producto.id ? {...item, cantidad: item.cantidad + 1} : item));
    } else {
      setCarrito([...carrito, {...producto, cantidad: 1}]);
    }
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  // --- CÁLCULOS MATEMÁTICOS ---
  const subtotal = carrito.reduce((sum, item) => sum + (Number(item.precio_venta) * item.cantidad), 0);
  const impuesto = subtotal * 0.13; // 13% de IVA (Cambiable)
  const total = subtotal; // Normalmente el precio de venta ya incluye IVA, si no, sería subtotal + impuesto

  // --- FUNCIÓN DE PAGO PROFESIONAL ---
  const handlePagar = async () => {
    if(carrito.length === 0) return;

    // 1. Preguntar con cuánto paga
    const { value: pagoInput } = await Swal.fire({
      title: 'Cobro en Caja 💵',
      html: `
        <div class="text-left">
          <p>Total a Pagar: <b>$${total.toFixed(2)}</b></p>
          <p class="text-sm text-gray-500">Impuestos incluidos ($${impuesto.toFixed(2)})</p>
        </div>
      `,
      input: 'number',
      inputLabel: '¿Con cuánto paga el cliente?',
      inputPlaceholder: '0.00',
      inputValue: total, // Sugerir el monto exacto
      showCancelButton: true,
      confirmButtonText: 'Cobrar',
      confirmButtonColor: '#10B981',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || Number(value) < total) {
          return '¡El monto debe ser mayor o igual al total!';
        }
      }
    });

    if (pagoInput) {
      const pago = Number(pagoInput);
      const cambio = pago - total;

      // 2. Mostrar Cambio y Confirmar
      const confirmacion = await Swal.fire({
        title: '¡Pago Recibido!',
        html: `
          <div class="text-3xl font-bold text-blue-600 mb-2">Cambio: $${cambio.toFixed(2)}</div>
          <p>¿Confirmar venta?</p>
        `,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: '✅ Confirmar e Imprimir',
        cancelButtonText: 'Corregir'
      });

      if (confirmacion.isConfirmed) {
        // 3. Guardar en Base de Datos
        try {
          const response = await fetch('/api/guardar_venta.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              items: carrito, 
              total: total,
              pago_con: pago,     // Enviamos cuánto entregó
              cambio: cambio,     // Enviamos el cambio
              impuesto: impuesto  // Enviamos el impuesto calculado
            })
          });

          if(response.ok) {
            setCarrito([]); // Limpiar carrito
            Swal.fire('Venta Registrada', '', 'success');
            // Aquí iría la impresión del ticket
          } else {
            Swal.fire('Error', 'No se pudo guardar la venta', 'error');
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()));
  const obtenerImagen = (ruta?: string) => ruta ? (ruta.startsWith('http') ? ruta : `/${ruta}`) : null;

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4 animate-fade-in">
      {/* IZQUIERDA: Catálogo */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar producto..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
          {productosFiltrados.map(prod => (
            <div key={prod.id} onClick={() => agregarAlCarrito(prod)} className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-blue-500 transition-all bg-white text-center group relative overflow-hidden">
               <div className="h-24 w-full bg-gray-100 rounded-md mb-2 overflow-hidden flex items-center justify-center">
                  {prod.imagen ? <img src={obtenerImagen(prod.imagen)!} className="h-full w-full object-cover" /> : <ShoppingCart className="text-gray-300" />}
               </div>
              <h3 className="font-bold text-gray-700 text-sm truncate">{prod.nombre}</h3>
              <p className="text-blue-600 font-bold">${Number(prod.precio_venta).toFixed(2)}</p>
              <div className="absolute top-2 right-2 bg-white/90 px-2 rounded-full text-xs font-bold text-gray-500 shadow-sm">{prod.stock_actual}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DERECHA: Ticket */}
      <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><ShoppingCart className="text-blue-600" /> Venta Actual</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {carrito.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div><p className="font-bold text-gray-800 text-sm">{item.nombre}</p><p className="text-xs text-gray-500">{item.cantidad} x ${Number(item.precio_venta).toFixed(2)}</p></div>
              <div className="flex items-center gap-2"><span className="font-bold text-gray-800">${(item.cantidad * Number(item.precio_venta)).toFixed(2)}</span><button onClick={() => eliminarDelCarrito(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button></div>
            </div>
          ))}
        </div>
        
        {/* ZONA DE TOTALES */}
        <div className="p-6 bg-gray-900 text-white rounded-b-xl">
          <div className="flex justify-between text-sm text-gray-400 mb-1"><span>Subtotal:</span><span>${(total - impuesto).toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-gray-400 mb-4"><span>Impuestos (13%):</span><span>${impuesto.toFixed(2)}</span></div>
          <div className="flex justify-between items-end mb-6 pt-4 border-t border-gray-700">
            <span className="text-lg">Total a Pagar:</span>
            <span className="text-4xl font-bold text-green-400">${total.toFixed(2)}</span>
          </div>
          <button onClick={handlePagar} className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
             <Calculator size={24} /> COBRAR
          </button>
        </div>
      </div>
    </div>
  );
};