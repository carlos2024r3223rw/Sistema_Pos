import { useEffect, useState } from 'react';
import { Search, Trash2, ShoppingCart, Calculator, Package } from 'lucide-react';
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

// --- FUNCIÓN DE IMPRESIÓN OPTIMIZADA PARA TICKET TÉRMICO ---
const imprimirTicket = (items: ItemCarrito[], total: number, pago: number, cambio: number) => {
  // Configuración de la empresa
  const empresa = {
    nombre: "MI TIENDA POS",
    direccion: "Calle Principal #123",
    telefono: "2222-0000",
    mensaje: "¡Gracias por su compra!"
  };

  const fecha = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const ventana = window.open('', 'PRINT', 'height=600,width=400');
  
  if (ventana) {
    ventana.document.write(`
      <html>
        <head>
          <title>Ticket ${Date.now()}</title>
          <style>
            /* ESTILOS PARA IMPRESORA TÉRMICA */
            @media print {
              @page { margin: 0; size: auto; } /* Quita márgenes del navegador */
              body { margin: 0 5px; } /* Pequeño margen interno */
            }
            body {
              font-family: 'Courier New', Courier, monospace; /* Fuente monoespaciada para alinear bien */
              font-size: 12px;     /* Tamaño legible en ticket */
              width: 100%;
              max-width: 80mm;     /* Ancho estándar de rollo térmico */
              color: #000;
              margin: 0;
              padding: 5px 0;
            }
            /* Utilidades de alineación */
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            
            /* Elementos del ticket */
            .header h2 { margin: 0; font-size: 16px; text-transform: uppercase; }
            .header p { margin: 2px 0; font-size: 11px; }
            
            .divider {
              border-top: 1px dashed #000;
              margin: 8px 0;
            }

            /* Tabla de productos */
            .item-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
              font-size: 11px;
            }
            .item-name { 
              flex: 1; 
              overflow: hidden; 
              white-space: nowrap; 
              text-overflow: ellipsis; /* Corta nombres muy largos con ... */
              margin-right: 5px;
            }

            /* Totales */
            .totals { margin-top: 10px; font-size: 12px; }
            .totals-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .grand-total { font-size: 16px; margin-top: 5px; border-top: 1px solid #000; padding-top: 5px; }

            .footer { margin-top: 15px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header center">
            <h2 class="bold">${empresa.nombre}</h2>
            <p>${empresa.direccion}</p>
            <p>Tel: ${empresa.telefono}</p>
            <br>
            <p>FECHA: ${fecha} ${hora}</p>
          </div>

          <div class="divider"></div>

          <div class="items">
            ${items.map(item => `
              <div class="item-row">
                <span>${item.cantidad} x </span>
                <span class="item-name">${item.nombre}</span>
                <span class="bold">$${(item.cantidad * item.precio_venta).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="divider"></div>

          <div class="totals">
            <div class="totals-row right">
              <span>Subtotal:</span>
              <span>$${(total / 1.13).toFixed(2)}</span>
            </div>
            <div class="totals-row right">
              <span>IVA (13%):</span>
              <span>$${(total - (total / 1.13)).toFixed(2)}</span>
            </div>
            <div class="totals-row bold right grand-total">
              <span>TOTAL:</span>
              <span>$${total.toFixed(2)}</span>
            </div>
            <br>
            <div class="totals-row right">
              <span>Efectivo:</span>
              <span>$${pago.toFixed(2)}</span>
            </div>
            <div class="totals-row bold right">
              <span>CAMBIO:</span>
              <span>$${cambio.toFixed(2)}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="footer center">
            <p>${empresa.mensaje}</p>
            <p>*** GRACIAS ***</p>
          </div>
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    
    // Esperamos 500ms para asegurar que cargue antes de imprimir
    setTimeout(() => {
      ventana.print();
      ventana.close();
    }, 500);
  }
};

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

  const subtotal = carrito.reduce((sum, item) => sum + (Number(item.precio_venta) * item.cantidad), 0);
  const impuesto = subtotal * 0.13; 
  const total = subtotal; 

  const handlePagar = async () => {
    if(carrito.length === 0) return;

    // 1. Pedir Efectivo
    const { value: pagoInput } = await Swal.fire({
      title: 'Cobro en Caja 💵',
      html: `
        <div class="text-left">
          <p class="text-lg">Total a Pagar: <b class="text-blue-600">$${total.toFixed(2)}</b></p>
        </div>
      `,
      input: 'number',
      inputLabel: 'Efectivo recibido:',
      inputValue: total, // Sugerir el total
      showCancelButton: true,
      confirmButtonText: 'Cobrar e Imprimir',
      confirmButtonColor: '#10B981',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || Number(value) < total) return '¡El pago es insuficiente!';
      }
    });

    if (pagoInput) {
      const pago = Number(pagoInput);
      const cambio = pago - total;

      // 2. Mostrar Cambio
      const confirmacion = await Swal.fire({
        title: '¡Pago Exitoso! ✅',
        html: `<div class="text-4xl font-bold text-green-600 mb-2">Cambio: $${cambio.toFixed(2)}</div>`,
        icon: 'success',
        confirmButtonText: 'Finalizar',
        timer: 3000, // Se cierra solo en 3 seg para agilizar
        timerProgressBar: true
      });

      if (confirmacion.isConfirmed || confirmacion.dismiss === Swal.DismissReason.timer) {
        try {
          // 3. Guardar en BD
          const response = await fetch('/api/guardar_venta.php', {
            method: 'POST',
            body: JSON.stringify({ items: carrito, total: total, pago_con: pago, cambio: cambio, impuesto: impuesto })
          });

          if (response.ok) {
            // 4. IMPRIMIR TICKET AUTOMÁTICAMENTE
            imprimirTicket(carrito, total, pago, cambio);
            
            // 5. Limpiar
            setCarrito([]); 
          }
        } catch (error) { console.error(error); }
      }
    }
  };

  const productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()));
  
  const obtenerImagen = (ruta?: string) => {
    if (!ruta) return null;
    return ruta.startsWith('http') ? ruta : `/${ruta}`;
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4 animate-fade-in">
      
      {/* IZQUIERDA: Catálogo */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col h-full">
        {/* Buscador */}
        <div className="relative mb-4 shrink-0">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar producto..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
            value={filtro} 
            onChange={(e) => setFiltro(e.target.value)} 
          />
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {productosFiltrados.map(prod => (
              <div 
                key={prod.id} 
                onClick={() => agregarAlCarrito(prod)} 
                className="bg-white border border-gray-200 rounded-xl cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all group overflow-hidden flex flex-col h-[240px]" 
              >
                {/* Imagen */}
                <div className="h-32 bg-gray-100 w-full flex items-center justify-center overflow-hidden relative">
                   {prod.imagen ? (
                     <img src={obtenerImagen(prod.imagen)!} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                     <Package className="text-gray-300" size={40} />
                   )}
                   <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm ${prod.stock_actual < 5 ? 'bg-red-500' : 'bg-gray-800/70'}`}>
                     {prod.stock_actual}
                   </div>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col justify-between flex-1">
                  <h3 className="font-semibold text-gray-700 text-sm leading-tight line-clamp-2" title={prod.nombre}>
                    {prod.nombre}
                  </h3>
                  <div className="mt-2 flex justify-between items-end">
                    <span className="text-lg font-bold text-blue-600">${Number(prod.precio_venta).toFixed(2)}</span>
                    <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ShoppingCart size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DERECHA: Ticket Carrito */}
      <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full shrink-0">
        <div className="p-5 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" size={20} /> Venta Actual
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
              <ShoppingCart size={48} className="opacity-20" />
              <p className="text-sm">Carrito vacío</p>
            </div>
          ) : (
            carrito.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{item.nombre}</p>
                  <p className="text-xs text-gray-500">{item.cantidad} x ${Number(item.precio_venta).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">${(item.cantidad * Number(item.precio_venta)).toFixed(2)}</span>
                  <button onClick={() => eliminarDelCarrito(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 bg-slate-900 text-white rounded-b-xl shadow-inner">
          <div className="space-y-2 mb-6 text-sm text-slate-400">
            <div className="flex justify-between"><span>Subtotal</span><span>${(total - impuesto).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Impuestos (13%)</span><span>${impuesto.toFixed(2)}</span></div>
          </div>
          <div className="flex justify-between items-end mb-6 pt-4 border-t border-slate-700">
            <span className="text-lg font-medium text-slate-300">Total</span>
            <span className="text-4xl font-bold text-green-400">${total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handlePagar}
            disabled={carrito.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
             <Calculator size={24} /> COBRAR
          </button>
        </div>
      </div>
    </div>
  );
};