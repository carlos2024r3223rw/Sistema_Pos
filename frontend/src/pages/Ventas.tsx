import { useEffect, useState } from "react";
import { Search, ShoppingCart, Trash2, Plus, Minus, Calculator, Package } from "lucide-react";
import Swal from "sweetalert2";

const API_BASE = "http://localhost/sistema_pos/api";

interface Product {
  id: number;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
  imagen?: string;
  id_categoria?: number;
}

interface CartItem extends Product {
  cantidad: number;
}

export const Ventas = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: number, nombre: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [metodoPago, setMetodoPago] = useState<string>("Efectivo");
  const [ticketData, setTicketData] = useState<any>(null);

  // Configuración de Toasts
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
    // Importante: no robar el foco para permitir que el Enter funcione en el ticket
    allowEnterKey: false,
  });

  /* =======================
     MANEJO DE TECLADO (TICKET)
  ======================= */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && ticketData) {
        e.preventDefault(); // Prevenir cualquier acción por defecto
        setTicketData(null);
      }
    };
    // Usar capture para asegurar que capturamos el evento antes que otros
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [ticketData]);

  /* =======================
     CARGAR PRODUCTOS Y CATEGORÍAS
  ======================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/productos.php`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categorias.php`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /* =======================
     CARRITO
  ======================= */
  const addToCart = (product: Product) => {
    const existing = cart.find(i => i.id === product.id);

    if (existing) {
      if (existing.cantidad >= product.stock_actual) {
        Toast.fire({ icon: 'warning', title: 'Stock insuficiente' });
        return;
      }
      setCart(cart.map(i =>
        i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      if (product.stock_actual < 1) {
        Toast.fire({ icon: 'error', title: 'Producto sin stock' });
        return;
      }
      setCart([...cart, { ...product, cantidad: 1 }]);
    }
    
    Toast.fire({
      icon: 'success',
      title: `${product.nombre} añadido`
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(i => {
      if (i.id !== id) return i;
      const qty = i.cantidad + delta;
      if (qty < 1) return i;
      if (qty > i.stock_actual) {
        Toast.fire({ icon: 'warning', title: 'Límite de stock alcanzado' });
        return i;
      }
      return { ...i, cantidad: qty };
    }));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(i => i.id !== id));
    Toast.fire({ icon: 'info', title: 'Producto removido' });
  };

  const total = cart.reduce(
    (sum, i) => sum + i.precio_venta * i.cantidad,
    0
  );

  const cobrar = async () => {
    if (cart.length === 0) return;

    let pago = total;
    let cambio = 0;

    if (metodoPago === 'Efectivo') {
      const { value } = await Swal.fire({
        title: "Pago en Efectivo",
        input: "number",
        inputLabel: `Total a cobrar: $${total.toFixed(2)}`,
        inputPlaceholder: 'Ingresa el monto recibido',
        showCancelButton: true,
        confirmButtonText: "Cobrar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#16a34a',
        inputValidator: v => (!v || Number(v) < total ? "Monto insuficiente" : undefined)
      });
      if (!value) return;
      pago = Number(value);
      cambio = pago - total;
    }

    try {
      const res = await fetch(`${API_BASE}/guardar_venta.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          total,
          pago_con: pago,
          cambio,
          metodo_pago: metodoPago
        })
      });

      if (res.ok) {
        setTicketData({
          fecha: new Date().toLocaleString(),
          items: [...cart],
          total,
          pago_con: pago,
          cambio,
          metodo_pago: metodoPago
        });
        setCart([]);
        setMetodoPago("Efectivo"); // Resetear método de pago
        fetchProducts();
        
        Toast.fire({
          icon: 'success',
          title: 'Venta completada'
        });
      } else {
        Swal.fire("Error", "No se pudo guardar la venta", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 p-4 gap-4 overflow-hidden">

      {/* PRODUCTOS */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 flex flex-col border border-gray-200">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            placeholder="Buscar producto o código de barras..."
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* CATEGORIAS */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === null ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            Todos los productos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <span>Cargando productos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto content-start pr-1">
            {products
              .filter(p =>
                (p.nombre ?? "").toLowerCase().includes(search.toLowerCase()) &&
                (selectedCategory ? p.id_categoria == selectedCategory : true)
              )
              .map(p => (
                <div
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="cursor-pointer bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden rounded-t-2xl">
                    <span className={`absolute top-2 right-2 text-[10px] font-black px-2 py-1 rounded-lg backdrop-blur-md z-10 uppercase ${p.stock_actual <= 5 ? 'bg-red-500 text-white' : 'bg-black/60 text-white'}`}>
                      {p.stock_actual <= 0 ? 'Agotado' : `Stock: ${p.stock_actual}`}
                    </span>
                    {p.imagen ? (
                      <img
                        src={p.imagen.startsWith('http') ? p.imagen : `http://localhost/sistema_pos/${p.imagen}`}
                        className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <Package className="text-gray-200 group-hover:text-blue-200 transition-colors" size={48} />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[40px]" title={p.nombre}>{p.nombre}</p>
                    <p className="text-blue-600 font-black text-lg mt-2">${Number(p.precio_venta).toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* CARRITO */}
      <div className="w-96 bg-slate-900 text-white rounded-2xl shadow-2xl p-5 flex flex-col border border-slate-800">
        <h2 className="flex items-center gap-3 text-xl font-black border-b border-slate-800 pb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShoppingCart size={20} />
          </div>
          Venta Actual
        </h2>

        <div className="flex-1 overflow-y-auto mt-6 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {cart.length === 0 && (
            <div className="text-center opacity-20 mt-28 flex flex-col items-center">
              <ShoppingCart size={64} strokeWidth={1} className="mb-4" />
              <span className="text-lg font-bold">Carrito vacío</span>
            </div>
          )}

          {cart.map(i => (
            <div key={i.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 group hover:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm leading-snug flex-1 pr-2">{i.nombre}</span>
                <button onClick={() => removeItem(i.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <button onClick={() => updateQty(i.id, -1)} className="hover:text-blue-400 p-1 transition-colors"><Minus size={14} /></button>
                  <span className="text-sm font-black min-w-[2rem] text-center">{i.cantidad}</span>
                  <button onClick={() => updateQty(i.id, 1)} className="hover:text-blue-400 p-1 transition-colors"><Plus size={14} /></button>
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-500 block">${Number(i.precio_venta).toFixed(2)} c/u</span>
                    <span className="text-green-400 font-black text-lg">
                        ${(i.cantidad * i.precio_venta).toFixed(2)}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-5 mt-4">
          <div className="mb-4">
            <label className="text-[10px] text-slate-500 block mb-1.5 font-black uppercase tracking-[2px]">Método de Pago</label>
            <div className="grid grid-cols-3 gap-2">
                {['Efectivo', 'Tarjeta', 'Transferencia'].map((m) => (
                    <button 
                        key={m}
                        onClick={() => setMetodoPago(m)}
                        className={`py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${metodoPago === m ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {m === 'Efectivo' ? '💵' : m === 'Tarjeta' ? '💳' : '🏦'} {m}
                    </button>
                ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6 bg-slate-800/30 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-500 font-black tracking-widest uppercase">Total a pagar</p>
            <p className="text-4xl font-black text-green-400 tabular-nums">
              ${total.toFixed(2)}
            </p>
          </div>

          <button
            onClick={cobrar}
            disabled={cart.length === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl font-black text-lg flex justify-center items-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-900/20 active:scale-95"
          >
            <Calculator size={24} /> FINALIZAR VENTA
          </button>
        </div>
      </div>

      {/* TICKET MODAL */}
      {ticketData && (
        <div 
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setTicketData(null)}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <div className="bg-white text-black w-85 p-8 shadow-2xl font-mono text-sm flex flex-col rounded-xl border-t-[12px] border-t-green-500" id="ticket-imprimir">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-gray-100 rounded-full mb-4">
                    <ShoppingCart className="text-green-600" size={32} />
                </div>
                <h2 className="font-black text-3xl mb-1 tracking-tighter">TIENDA POS</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Comprobante de Venta</p>
                <div className="h-px bg-gray-100 w-full my-4"></div>
                <p className="text-xs font-bold">{ticketData.fecha}</p>
              </div>
              
              <div className="border-b-2 border-dashed border-gray-200 mb-4 pb-3">
                <div className="flex justify-between font-black text-[10px] text-gray-400 uppercase">
                  <span>Cant / Descripción</span>
                  <span>Importe</span>
                </div>
              </div>
              
              <div className="mb-6 space-y-3 min-h-[120px]">
                {ticketData.items.map((item: any, i: number) => (
                  <div key={i} className="text-xs">
                    <div className="font-black uppercase text-gray-800">{item.nombre}</div>
                    <div className="flex justify-between text-gray-500 mt-1">
                      <span>{item.cantidad} x ${Number(item.precio_venta).toFixed(2)}</span>
                      <span className="text-black font-black">${(item.cantidad * item.precio_venta).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t-2 border-dashed border-gray-200 pt-5 mb-8 space-y-2">
                <div className="flex justify-between font-black text-2xl border-b border-gray-50 pb-2">
                  <span className="tracking-tighter">TOTAL</span>
                  <span className="tabular-nums">${ticketData.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 pt-2">
                  <span className="font-bold">MÉTODO: {ticketData.metodo_pago.toUpperCase()}</span>
                  <span className="tabular-nums">${ticketData.pago_con.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-black bg-gray-50 p-2 rounded-lg mt-2">
                  <span>CAMBIO ENTREGADO</span>
                  <span className="tabular-nums">${ticketData.cambio.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-center mt-auto">
                <div className="bg-gray-100 h-12 flex items-center justify-center rounded-lg mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Gracias por su compra</span>
                </div>
                <p className="text-[9px] text-gray-300 font-bold uppercase">Software POS v1.2</p>
              </div>
            </div>
            
            {/* BOTONES DEL TICKET */}
            <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const printContent = document.getElementById('ticket-imprimir');
                  const WinPrint = window.open('', '', 'width=350,height=700');
                  if (WinPrint && printContent) {
                    WinPrint.document.write(`
                      <html>
                        <head><style>
                          @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
                          body { font-family: 'Courier Prime', monospace; font-size: 13px; margin: 0; padding: 20px; width: 300px; color: black; }
                          .text-center { text-align: center; }
                          .flex { display: flex; justify-content: space-between; }
                          .font-black { font-weight: 700; }
                          .text-3xl { font-size: 24px; }
                          .text-2xl { font-size: 18px; }
                          .text-xs { font-size: 11px; }
                          .border-b-2 { border-bottom: 2px dashed #000; margin-bottom: 10px; padding-bottom: 10px; }
                          .border-t-2 { border-top: 2px dashed #000; margin-top: 10px; padding-top: 10px; }
                          .mb-8 { margin-bottom: 30px; }
                          .mt-auto { margin-top: 30px; }
                          .uppercase { text-transform: uppercase; }
                        </style></head>
                        <body>${printContent.innerHTML}</body>
                      </html>
                    `);
                    WinPrint.document.close();
                    WinPrint.focus();
                    setTimeout(() => { WinPrint.print(); WinPrint.close(); }, 300);
                  }
                }}
                className="bg-green-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-green-400 hover:-translate-y-1 transition-all active:scale-95"
              >
                🖨️ IMPRIMIR
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setTicketData(null); }}
                className="bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-white/30 transition-all border border-white/20"
              >
                CERRAR (ENTER)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
