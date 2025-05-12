import { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './About';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import SidebarNav from './SidebarNav';
import AnimatedRoutes from './components/AnimatedRoutes';
import type { HistoricoItem, TipoVehiculoAPI } from './types';

// Función para traducir el mes de referencia
const traducirMesReferencia = (mesReferenciaPT: string): string => {
  if (!mesReferenciaPT) return '';
  const [mesPT, anio] = mesReferenciaPT.toLowerCase().split(' de ');
  const mesesMap: { [key: string]: string } = {
    janeiro: 'enero',
    fevereiro: 'febrero',
    março: 'marzo',
    abril: 'abril',
    maio: 'mayo',
    junho: 'junio',
    julho: 'julio',
    agosto: 'agosto',
    setembro: 'septiembre',
    outubro: 'octubre',
    novembro: 'noviembre',
    dezembro: 'diciembre'
  };
  const mesES = mesesMap[mesPT] || mesPT; // Si no se encuentra, usa el original
  return `${mesES.charAt(0).toUpperCase() + mesES.slice(1)} de ${anio}`;
};

// Crear el Contexto para limpiar la caché
interface ICacheContext {
  cacheClearTrigger: number; // Un número que cambia para disparar el efecto
  triggerCacheClear: () => void; // Función para cambiar el número
}
export const CacheContext = createContext<ICacheContext>({ 
  cacheClearTrigger: 0, 
  triggerCacheClear: () => {} 
});

// --- CONTEXTO PARA DATOS DEL HISTÓRICO ---
interface IHistoricoContext {
  historico: HistoricoItem[];
  loadingHistorico: boolean;
  errorHistorico: string | null;
  agregarAlHistorico: (item: HistoricoItem) => Promise<void>;
}
export const HistoricoContext = createContext<IHistoricoContext>({
  historico: [],
  loadingHistorico: true,
  errorHistorico: null,
  agregarAlHistorico: async () => { console.warn("agregarAlHistorico no implementado"); },
});

export default function App() {
  // Estado y función para el trigger de limpieza de caché
  const [cacheClearTrigger, setCacheClearTrigger] = useState(0);
  const triggerCacheClear = () => {
    console.log("Disparando limpieza de caché...");
    setCacheClearTrigger(prev => prev + 1); // Incrementar para disparar el efecto
  };

  // Estado centralizado para el histórico
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [errorHistorico, setErrorHistorico] = useState<string | null>(null);

  // Cargar histórico inicial desde el backend
  useEffect(() => {
    setLoadingHistorico(true);
    fetch('http://localhost:4000/historico')
      .then(res => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status} al cargar histórico`);
        return res.json();
      })
      .then(data => {
        setHistorico(Array.isArray(data) ? data.filter(Boolean) : []); // Filtrar nulos por si acaso
        setErrorHistorico(null);
      })
      .catch(err => {
        console.error("Error cargando histórico:", err);
        setErrorHistorico(err.message);
        setHistorico([]);
      })
      .finally(() => setLoadingHistorico(false));
  }, []);

  // Función para agregar un nuevo ítem al histórico (local y backend)
  const agregarAlHistorico = useCallback(async (item: HistoricoItem) => {
    // Optimistic update
    setHistorico(prevHistorico => [item, ...prevHistorico]); 
    try {
      const response = await fetch('http://localhost:4000/historico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al guardar en histórico`);
        // Considerar revertir el estado optimista aquí si falla el POST
        // setHistorico(prevHistorico => prevHistorico.filter(h => h !== item)); // Simple revert
      }
      // Opcional: recargar el histórico completo para asegurar consistencia si el backend modifica el ítem
      // fetch('http://localhost:4000/historico').then(r=>r.json()).then(d=>setHistorico(d)); 
    } catch (error: any) {
      console.error("Error guardando en histórico:", error);
      setErrorHistorico(error.message); // Mostrar error al usuario
       // Revertir si la API falla
      setHistorico(prevHistorico => prevHistorico.filter(h => h !== item && (h.marca !== item.marca || h.modelo !== item.modelo || h.ano !== item.ano)));
    }
  }, []);

  return (
    <Router>
      <CacheContext.Provider value={{ cacheClearTrigger, triggerCacheClear }}>
        <HistoricoContext.Provider value={{ historico, loadingHistorico, errorHistorico, agregarAlHistorico }}>
          <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <header className="bg-gray-800 text-white p-4 shadow-md">
              <div className="container mx-auto flex items-center">
                <div className="flex-1"></div>
                <h1 className="text-2xl font-bold text-center px-4">
                  <Link to="/">Explorador Tabela FIPE</Link>
                </h1>
                <nav className="flex-1 text-right">
                  <Link to="/about" className="hover:text-blue-400 transition-colors">Acerca de</Link>
                </nav>
              </div>
            </header>

            <div className="flex flex-1 pt-4">
              <aside className="w-64 p-4 space-y-4 bg-gray-800 shadow-lg fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto">
                <SidebarNav />
              </aside>

              <main className="flex-1 p-4 ml-64 overflow-y-auto" style={{ position: 'relative' }}>
                <AnimatedRoutes />
              </main>
            </div>

            <footer className="bg-gray-800 text-white p-3 text-center text-sm shadow-md mt-auto">
              <p>&copy; {new Date().getFullYear()} FIPE Explorer. Todos os direitos reservados.</p>
            </footer>
          </div>
        </HistoricoContext.Provider>
      </CacheContext.Provider>
    </Router>
  );
}

// función extraerAnoComb para uso en App
function extraerAnoComb(nombreAnoCompleto: string) {
  const match = nombreAnoCompleto.match(/^(\d{4})(.*)$/);
  if (match) {
    const yearNum = parseInt(match[1], 10);
    if (!isNaN(yearNum) && yearNum <= 2300) {
      return { ano: match[1], combustible: match[2].trim().replace(/\(/g, '').replace(/\)/g, '') };
    }
  }
  return { ano: '', combustible: nombreAnoCompleto.trim() };
}
