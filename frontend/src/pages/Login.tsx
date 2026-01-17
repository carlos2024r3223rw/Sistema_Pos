import { useState } from 'react';
import { LogIn, User, Lock, Store, TrendingUp, ShieldCheck } from 'lucide-react';

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password: pass })
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('pos_token', data.token);
        localStorage.setItem('pos_user', JSON.stringify(data.usuario));
        onLogin();
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      // Usamos 'error' en la consola para que no marque variable no usada
      console.error(error);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans overflow-hidden">
      {/* --- CSS COMPLETO (CON RESET) --- */}
      <style>{`
        /* 1. RESET (Preflight) - Vital para que se vea bien */
        *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: #e5e7eb; }
        html { line-height: 1.5; -webkit-text-size-adjust: 100%; font-family: ui-sans-serif, system-ui, sans-serif; }
        body { margin: 0; line-height: inherit; }
        h1, h2, p { margin: 0; }
        button, input { font-family: inherit; font-size: 100%; line-height: inherit; color: inherit; margin: 0; padding: 0; }
        button { background-color: transparent; cursor: pointer; }
        
        /* 2. Clases de Utilidad */
        .min-h-screen { min-height: 100vh; }
        .flex { display: flex; }
        .w-full { width: 100%; }
        .hidden { display: none; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-0 { z-index: 0; }
        .z-10 { z-index: 10; }
        .overflow-hidden { overflow: hidden; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .text-center { text-align: center; }
        
        /* Media Query para PC */
        @media (min-width: 1024px) {
          .lg\\:flex { display: flex; }
          .lg\\:w-1\\/2 { width: 50%; }
          .lg\\:hidden { display: none; }
          .lg\\:p-12 { padding: 3rem; }
        }

        /* Fondos y Colores */
        .bg-slate-900 { background-color: #0f172a; }
        .bg-white { background-color: #ffffff; }
        .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
        .from-slate-900 { --tw-gradient-from: #0f172a; --tw-gradient-to: rgb(15 23 42 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
        .via-blue-900 { --tw-gradient-to: rgb(30 58 138 / 0); --tw-gradient-stops: var(--tw-gradient-from), #1e3a8a, var(--tw-gradient-to); }
        .to-indigo-900 { --tw-gradient-to: #312e81; }
        .opacity-90 { opacity: 0.9; }
        
        /* Decoración */
        .rounded-full { border-radius: 9999px; }
        .rounded-2xl { border-radius: 1rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-bl-full { border-bottom-left-radius: 9999px; }
        .rounded-tr-full { border-top-right-radius: 9999px; }
        .blur-3xl { filter: blur(64px); }
        .blur-2xl { filter: blur(40px); }
        
        .-top-24 { top: -6rem; }
        .-left-24 { left: -6rem; }
        .bottom-0 { bottom: 0; }
        .right-0 { right: 0; }
        .left-0 { left: 0; }
        .top-0 { top: 0; }
        .top-1\\/2 { top: 50%; }
        .left-1\\/2 { left: 50%; }
        .-translate-x-1\\/2 { transform: translateX(-50%); }
        .-translate-y-1\\/2 { transform: translateY(-50%); }
        
        .w-96 { width: 24rem; }
        .h-96 { height: 24rem; }
        .w-\\[500px\\] { width: 500px; }
        .h-\\[500px\\] { height: 500px; }
        .w-64 { width: 16rem; }
        .h-64 { height: 16rem; }
        .w-48 { width: 12rem; }
        .h-48 { height: 12rem; }

        .bg-blue-500\\/20 { background-color: rgb(59 130 246 / 0.2); }
        .bg-indigo-500\\/20 { background-color: rgb(99 102 241 / 0.2); }
        .bg-cyan-500\\/10 { background-color: rgb(6 182 212 / 0.1); }
        .bg-blue-50 { background-color: #eff6ff; }
        .bg-gradient-to-bl { background-image: linear-gradient(to bottom left, var(--tw-gradient-stops)); }
        .from-blue-50 { --tw-gradient-from: #eff6ff; --tw-gradient-to: rgb(239 246 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
        .to-transparent { --tw-gradient-to: transparent; }
        .bg-gradient-to-tr { background-image: linear-gradient(to top right, var(--tw-gradient-stops)); }
        .from-slate-50 { --tw-gradient-from: #f8fafc; --tw-gradient-to: rgb(248 250 252 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
        .opacity-70 { opacity: 0.7; }

        /* Textos */
        .text-white { color: #fff; }
        .text-blue-100 { color: #dbeafe; }
        .text-blue-200\\/80 { color: rgb(191 219 254 / 0.8); }
        .text-blue-100\\/80 { color: rgb(219 234 254 / 0.8); }
        .text-white\\/90 { color: rgb(255 255 255 / 0.9); }
        .text-white\\/60 { color: rgb(255 255 255 / 0.6); }
        .text-green-300 { color: #86efac; }
        .text-blue-300 { color: #93c5fd; }
        .text-blue-600 { color: #2563eb; }
        .text-gray-800 { color: #1f2937; }
        .text-gray-500 { color: #6b7280; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-500 { color: #64748b; }
        .text-slate-700 { color: #334155; }
        .text-gray-400 { color: #9ca3af; }
        .text-red-600 { color: #dc2626; }
        
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-light { font-weight: 300; }
        .text-5xl { font-size: 3rem; line-height: 1; }
        .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        
        .tracking-tight { letter-spacing: -0.025em; }
        .tracking-wider { letter-spacing: 0.05em; }
        .uppercase { text-transform: uppercase; }
        .leading-tight { line-height: 1.25; }
        .leading-relaxed { line-height: 1.625; }
        
        .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
        .text-transparent { color: transparent; }
        .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
        .from-white { --tw-gradient-from: #fff; --tw-gradient-to: rgb(255 255 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
        .to-blue-200 { --tw-gradient-to: #bfdbfe; }

        /* Espaciado */
        .p-12 { padding: 3rem; }
        .p-8 { padding: 2rem; }
        .p-4 { padding: 1rem; }
        .p-3 { padding: 0.75rem; }
        .p-2 { padding: 0.5rem; }
        .py-3\\.5 { padding-top: 0.875rem; padding-bottom: 0.875rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .pl-12 { padding-left: 3rem; }
        .pr-4 { padding-right: 1rem; }
        
        .mb-12 { margin-bottom: 3rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mt-1 { margin-top: 0.25rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        .mt-12 { margin-top: 3rem; }
        .ml-1 { margin-left: 0.25rem; }
        
        .gap-4 { gap: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .space-y-5 > * + * { margin-top: 1.25rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }
        .space-y-2 > * + * { margin-top: 0.5rem; }

        /* Componentes */
        .max-w-lg { max-width: 32rem; }
        .max-w-\\[420px\\] { max-width: 420px; }
        .w-full { width: 100%; }
        
        .bg-white\\/10 { background-color: rgb(255 255 255 / 0.1); }
        .bg-white\\/5 { background-color: rgb(255 255 255 / 0.05); }
        .backdrop-blur-md { backdrop-filter: blur(12px); }
        .backdrop-blur-sm { backdrop-filter: blur(4px); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05); }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05); }
        .shadow-blue-500\\/30 { box-shadow: 0 20px 25px -5px rgb(59 130 246 / 0.3), 0 8px 10px -6px rgb(59 130 246 / 0.3); }
        
        .border { border-width: 1px; }
        .border-white\\/10 { border-color: rgb(255 255 255 / 0.1); }
        .border-white\\/5 { border-color: rgb(255 255 255 / 0.05); }
        .border-green-500\\/30 { border-color: rgb(34 197 94 / 0.3); }
        .border-blue-500\\/30 { border-color: rgb(59 130 246 / 0.3); }
        .border-blue-100 { border-color: #dbeafe; }
        .border-gray-200 { border-color: #e5e7eb; }
        .border-slate-200 { border-color: #e2e8f0; }
        .border-red-100 { border-color: #fee2e2; }
        
        .bg-gray-50 { background-color: #f9fafb; }
        .bg-slate-50 { background-color: #f8fafc; }
        .bg-blue-100 { background-color: #dbeafe; }
        .bg-red-50 { background-color: #fef2f2; }
        
        /* Inputs y Botones */
        .group { position: relative; }
        .left-4 { left: 1rem; }
        .top-3\\.5 { top: 0.875rem; }
        .outline-none { outline: 2px solid transparent; outline-offset: 2px; }
        .focus\\:bg-white:focus { background-color: #fff; }
        .focus\\:ring-2:focus { box-shadow: 0 0 0 2px var(--tw-ring-color); }
        .focus\\:ring-blue-500\\/20:focus { --tw-ring-color: rgb(59 130 246 / 0.2); }
        .focus\\:border-blue-500:focus { border-color: #3b82f6; }
        .group-focus-within .group-focus-within\\:text-blue-600 { color: #2563eb; }
        .group-focus-within .group-focus-within\\:text-blue-500 { color: #3b82f6; }
        .placeholder\\:text-slate-400::placeholder { color: #94a3b8; }
        .focus\\:shadow-md:focus { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
        .hover\\:underline:hover { text-decoration-line: underline; }
        
        .from-blue-600 { --tw-gradient-from: #2563eb; --tw-gradient-to: rgb(37 99 235 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
        .to-indigo-600 { --tw-gradient-to: #4f46e5; }
        .hover\\:from-blue-700:hover { --tw-gradient-from: #1d4ed8; }
        .hover\\:to-indigo-700:hover { --tw-gradient-to: #4338ca; }
        .disabled\\:from-blue-400:disabled { --tw-gradient-from: #60a5fa; }
        .disabled\\:to-indigo-400:disabled { --tw-gradient-to: #818cf8; }
        .disabled\\:cursor-not-allowed:disabled { cursor: not-allowed; }
        .hover\\:shadow-blue-500\\/50:hover { box-shadow: 0 20px 25px -5px rgb(59 130 246 / 0.5), 0 8px 10px -6px rgb(59 130 246 / 0.5); }
        .active\\:scale-\\[0\\.98\\]:active { transform: scale(0.98); }
        .inline-flex { display: inline-flex; }
        
        /* Animaciones y Transiciones */
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .duration-300 { transition-duration: 300ms; }
        .transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
        .hover\\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; transform: scale(1.05); }
        .hover\\:translate-x-2:hover { --tw-translate-x: 0.5rem; transform: translateX(0.5rem); }
        .hover\\:-translate-y-0\\.5:hover { --tw-translate-y: -0.125rem; transform: translateY(-0.125rem); }
        .group-hover\\:translate-x-1:hover { --tw-translate-x: 0.25rem; transform: translateX(0.25rem); }
        .hover\\:bg-white\\/10:hover { background-color: rgb(255 255 255 / 0.1); }
        .hover\\:text-blue-700:hover { color: #1d4ed8; }

        .w-5 { width: 1.25rem; }
        .h-5 { height: 1.25rem; }
        .w-6 { width: 1.5rem; }
        .h-6 { height: 1.5rem; }
        .border-3 { border-width: 3px; }
        .border-2 { border-width: 2px; }
        .border-white\\/30 { border-color: rgb(255 255 255 / 0.3); }
        .border-t-white { border-top-color: #fff; }
        .shrink-0 { flex-shrink: 0; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
        .animate-pulse-slow { animation: pulse-slow 4s infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* SECCIÓN IZQUIERDA: BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 opacity-90 z-0"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-float"></div>

        <div className="relative z-10 text-white p-12 max-w-lg animate-fade-in-up">
            <div className="mb-12 flex items-center gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 transform hover:scale-105 transition-transform duration-300">
                    <Store size={40} className="text-blue-100" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">POS System</h1>
                  <p className="text-blue-200/80 text-sm font-medium tracking-wider uppercase mt-1">Enterprise Edition</p>
                </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                El control total de tu negocio.
            </h2>
            <p className="text-blue-100/80 text-xl mb-12 leading-relaxed font-light">
                Gestión de inventario inteligente, ventas rápidas y métricas precisas en una sola plataforma segura.
            </p>

            <div className="space-y-5">
                <div className="flex items-center gap-4 text-white/90 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2">
                    <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 shadow-inner">
                      <TrendingUp size={24} className="text-green-300"/>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Analítica en Tiempo Real</p>
                      <p className="text-sm text-white/60">Toma decisiones basadas en datos</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-white/90 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2" style={{transitionDelay: '100ms'}}>
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30 shadow-inner">
                      <ShieldCheck size={24} className="text-blue-300"/>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Seguridad Avanzada</p>
                      <p className="text-sm text-white/60">Tus datos siempre protegidos</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: FORMULARIO */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-0 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-slate-50 to-transparent rounded-tr-full -z-0"></div>

        <div className="max-w-[420px] w-full animate-fade-in-up z-10" style={{animationDelay: '0.2s'}}>
          
          <div className="text-center mb-10">
            <div className="lg:hidden inline-flex p-4 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-100">
                <Store size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">¡Bienvenido de nuevo!</h2>
            <p className="text-slate-500 text-lg">Ingresa a tu panel de control</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                  <User size={16} className="text-blue-500" /> Usuario
                </label>
                <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300">
                      <User size={22} />
                    </div>
                    <input 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-medium text-slate-700 placeholder:text-slate-400 shadow-sm focus:shadow-md" 
                      placeholder="Ingresa tu usuario"
                      value={usuario}
                      onChange={e => setUsuario(e.target.value)}
                      required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Lock size={16} className="text-blue-500" /> Contraseña
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all">¿Olvidaste tu clave?</a>
                </div>
                <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300">
                      <Lock size={22} />
                    </div>
                    <input 
                      type="password"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all duration-300 font-medium text-slate-700 placeholder:text-slate-400 shadow-sm focus:shadow-md" 
                      placeholder="••••••••"
                      value={pass}
                      onChange={e => setPass(e.target.value)}
                      required
                    />
                </div>
            </div>
            
            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3 border border-red-100 animate-pulse shadow-sm">
                  <ShieldCheck size={20} className="shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
            )}

            <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:scale-[0.98] flex justify-center items-center gap-3 text-lg mt-6 group"
            >
                {loading ? (
                    <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verificando...</span>
                    </>
                ) : (
                    <>
                        <span>Iniciar Sesión</span>
                        <LogIn size={22} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-12">
            © 2026 POS System v1.2 • Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
};