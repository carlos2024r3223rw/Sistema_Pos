import { useEffect, useState } from 'react';
import { Calendar, User, Search, Printer, AlertCircle } from 'lucide-react';

interface Venta {
  id: number;
  fecha_venta: string;
  total: number;
  pago_con?: number;
  cambio?: number;
  cajero: string;
}

interface DetalleVenta {
  nombre: string;
  cantidad: number;
  precio_venta: number;
}

// --- FUNCIÓN DE RE-IMPRESIÓN ---
const reimprimirTicket = (venta: Venta, items: DetalleVenta[]) => {
  const empresa = {
    nombre: "MI TIENDA POS",
    direccion: "Calle Principal #123",
    telefono: "2222-0000",
    mensaje: "¡Gracias por su compra!"
  };

  const fechaObj = new Date(venta.fecha_venta);
  const fecha = fechaObj.toLocaleDateString();
  const hora = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const pago = venta.pago_con ? Number(venta.pago_con) : Number(venta.total);
  const cambio = venta.cambio ? Number(venta.cambio) : 0;

  const ventana = window.open('', 'PRINT', 'height=600,width=400');
  
  if (ventana) {
    ventana.document.write(`
      <html>
        <head>
          <title>Reimpresión #${venta.id}</title>
          <style>
            @page { margin: 0; size: 80mm auto; }
            body {
              font-family: 'Courier New', monospace;
              width: 78mm;
              margin: 0;
              padding: 5px;
              font-size: 12px;
              color: #000;
            }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 5px 0; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .item-name { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-right: 5px; }
            .totals-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
            .grand-total { font-size: 14px; margin-top: 5px; border-top: 1px solid #000; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="center">
            <h3 style="margin:0">${empresa.nombre}</h3>
            <p style="margin:0; font-size: 10px;">REIMPRESIÓN</p>
            <p style="margin:2px 0">Ticket: #${String(venta.id).padStart(6, '0')}</p>
            <p style="margin:2px 0">${fecha} - ${hora}</p>
          </div>

          <div class="divider"></div>

          <div>
            ${items.map(item => `
              <div class="item-row">
                <span>${item.cantidad}</span>
                <span class="item-name">${item.nombre}</span>
                <span class="bold">$${(item.cantidad * item.precio_venta).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="divider"></div>

          <div>
            <div class="totals-row right">
              <span>Subtotal:</span>
              <span>$${(venta.total / 1.13).toFixed(2)}</span>
            </div>
            <div class="totals-row right">
              <span>IVA (13%):</span>
              <span>$${(venta.total - (venta.total / 1.13)).toFixed(2)}</span>
            </div>
            <div class="totals-row bold right grand-total">
              <span>TOTAL:</span>
              <span>$${Number(venta.total).toFixed(2)}</span>
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
          <div class="center" style="font-size: 10px;">
            <p>${empresa.mensaje}</p>
          </div>
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => { ventana.print(); ventana.close(); }, 500);
  }
};

export const Historial = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch('/api/ventas.php')
      .then(res => res.json())
      .then(data => setVentas(data))
      .catch(err => console.error(err));
  }, []);

  const handleImprimir = async (venta: Venta) => {
    try {
      const res = await fetch(`/api/detalle_venta.php?id=${venta.id}`);
      const items: DetalleVenta[] = await res.json();

      if (items.length > 0) {
        reimprimirTicket(venta, items);
      } else {
        alert("No se encontraron detalles de esta venta.");
      }
    } catch (error) {
      console.error("Error recuperando ticket", error);
      alert("Error al recuperar el ticket.");
    }
  };

  const ventasFiltradas = ventas.filter(v => 
    v.id.toString().includes(busqueda) || 
    (v.cajero && v.cajero.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Historial de Transacciones</h1>
          <p className="text-gray-500 text-sm">Registro completo y reimpresión</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar ID o Cajero..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ID Venta</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cajero</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ventasFiltradas.map((venta) => (
                <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-blue-600 font-medium">#{String(venta.id).padStart(6, '0')}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(venta.fecha_venta).toLocaleDateString()} 
                      <span className="text-gray-400 text-xs">
                        {new Date(venta.fecha_venta).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold">
                        <User size={12} />
                      </div>
                      {venta.cajero || 'Admin'}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800 text-right">${Number(venta.total).toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleImprimir(venta)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-300 shadow-sm"
                      title="Reimprimir Ticket"
                    >
                      <Printer size={16} /> Copia
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ventasFiltradas.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              <AlertCircle size={48} className="mx-auto mb-2 opacity-20" />
              <p>No se encontraron ventas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};