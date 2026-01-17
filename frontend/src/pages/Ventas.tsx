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
}

interface CartItem extends Product {
  cantidad: number;
}

export const Ventas = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* =======================
     CARGAR PRODUCTOS
  ======================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/productos.php`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire("Error", "No se pudieron cargar productos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =======================
     CARRITO
  ======================= */
  const addToCart = (product: Product) => {
    const existing = cart.find(i => i.id === product.id);

    if (existing) {
      if (existing.cantidad >= product.stock_actual) return;
      setCart(cart.map(i =>
        i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      if (product.stock_actual < 1) return;
      setCart([...cart, { ...product, cantidad: 1 }]);
    }
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(i => {
      if (i.id !== id) return i;
      const qty = i.cantidad + delta;
      if (qty < 1 || qty > i.stock_actual) return i;
      return { ...i, cantidad: qty };
    }));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const total = cart.reduce(
    (sum, i) => sum + i.precio_venta * i.cantidad,
    0
  );


  const cobrar = async () => {
    if (cart.length === 0) return;

    const { value } = await Swal.fire({
      title: "Finalizar venta",
      input: "number",
      inputLabel: `Total: $${total.toFixed(2)}`,
      showCancelButton: true,
      confirmButtonText: "Cobrar",
      inputValidator: v => (!v || Number(v) < total ? "Monto insuficiente" : undefined)
    });

    if (!value) return;

    const pago = Number(value);
    const cambio = pago - total;

    const res = await fetch(`${API_BASE}/guardar_venta.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        total,
        pago_con: pago,
        cambio
      })
    });

    if (res.ok) {
      Swal.fire("Venta realizada", `Cambio: $${cambio.toFixed(2)}`, "success");
      setCart([]);
      fetchProducts();
    } else {
      Swal.fire("Error", "No se pudo guardar la venta", "error");
    }
  };


  return (
    <div className="flex h-screen bg-slate-100 p-4 gap-4">

      {/* PRODUCTOS */}
      <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-3 py-2 border rounded-lg"
            placeholder="Buscar producto..."
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">Cargando…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto">
            {products
              .filter(p =>
                (p.nombre ?? "").toLowerCase().includes(search.toLowerCase())
              )
              .map(p => (
                <div
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="cursor-pointer bg-white border rounded-xl hover:shadow-lg transition"
                >
                  <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                    <span className="absolute top-2 right-2 text-xs bg-black text-white px-2 rounded">
                      Stock {p.stock_actual}
                    </span>
                    {p.imagen ? (
  <img
    src={`http://localhost/sistema_pos/${p.imagen}`}
    onError={(e) => (e.currentTarget.style.display = 'none')}
  />
) : (
  <Package />
)}

                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold">{p.nombre}</p>
                    <p className="text-green-600 font-extrabold">${p.precio_venta}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* CARRITO */}
      <div className="w-96 bg-slate-900 text-white rounded-xl shadow p-4 flex flex-col">
        <h2 className="flex items-center gap-2 text-lg font-extrabold border-b pb-3">
          <ShoppingCart /> Resumen de venta
        </h2>

        <div className="flex-1 overflow-y-auto mt-4 space-y-3">
          {cart.length === 0 && (
            <div className="text-center opacity-30 mt-20">Carrito vacío</div>
          )}

          {cart.map(i => (
            <div key={i.id} className="bg-slate-800 p-3 rounded">
              <div className="flex justify-between">
                <span className="font-bold text-sm">{i.nombre}</span>
                <button onClick={() => removeItem(i.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(i.id, -1)}><Minus size={14} /></button>
                  <span>{i.cantidad}</span>
                  <button onClick={() => updateQty(i.id, 1)}><Plus size={14} /></button>
                </div>
                <span className="text-green-400 font-bold">
                  ${(i.cantidad * i.precio_venta).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-gray-400">TOTAL</p>
          <p className="text-4xl font-black text-green-400 text-right">
            ${total.toFixed(2)}
          </p>
          <button
            onClick={cobrar}
            disabled={cart.length === 0}
            className="w-full mt-4 py-3 bg-green-600 rounded-lg font-bold flex justify-center gap-2 disabled:opacity-30"
          >
            <Calculator /> COBRAR
          </button>
        </div>
      </div>
    </div>
  );
};
