import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './About';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import SidebarFiltros from './SidebarFiltros';
import ResultadoConsulta from './ResultadoConsulta';
import SidebarNav from './SidebarNav';
import HistoricoPage from './HistoricoPage';

// Definimos un tipo para las marcas para mayor claridad con TypeScript
interface Marca {
  codigo: string;
  nome: string;
}

interface Modelo {
  codigo: number; // La API devuelve el código de modelo como número
  nome: string;
}

interface ApiResponseModelos {
  modelos: Modelo[];
  anos: { codigo: string; nome: string }[]; // Incluimos 'anos' aunque no lo usemos activamente ahora
}

interface AnoValor {
  codigo: string; // ej: "2015-1" (gasolina), "2020-3" (diesel)
  nome: string;   // ej: "2015 Gasolina", "2020 Diesel"
}

interface VehiculoFipe {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

// Tipos de vehículos soportados por la API (y por nuestra app)
type TipoVehiculoAPI = 'carros' | 'motos' | 'caminhoes';

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

function Home() {
  const [tipoVehiculo, setTipoVehiculo] = useState<TipoVehiculoAPI>('carros');
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [loadingMarcas, setLoadingMarcas] = useState<boolean>(false);
  const [errorMarcas, setErrorMarcas] = useState<string | null>(null);
  const [marcaSearchTerm, setMarcaSearchTerm] = useState(''); // Estado para búsqueda de marcas

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [selectedModelo, setSelectedModelo] = useState<Modelo | null>(null);
  const [loadingModelos, setLoadingModelos] = useState<boolean>(false);
  const [errorModelos, setErrorModelos] = useState<string | null>(null);

  const [anosDisponibles, setAnosDisponibles] = useState<AnoValor[]>([]);
  const [selectedAno, setSelectedAno] = useState<AnoValor | null>(null);
  const [loadingAnos, setLoadingAnos] = useState<boolean>(false);
  const [errorAnos, setErrorAnos] = useState<string | null>(null);

  const [vehiculoFipe, setVehiculoFipe] = useState<VehiculoFipe | null>(null);
  const [loadingVehiculo, setLoadingVehiculo] = useState<boolean>(false);
  const [errorVehiculo, setErrorVehiculo] = useState<string | null>(null);

  const marcasCache = useRef<{ [tipo: string]: Marca[] }>({});
  const modelosCache = useRef<{ [key: string]: Modelo[] }>({});
  const anosCache = useRef<{ [key: string]: AnoValor[] }>({});

  const { cacheClearTrigger } = useContext(CacheContext);

  // Efecto para limpiar la caché cuando cambie el trigger del contexto
  useEffect(() => {
    if (cacheClearTrigger > 0) { // Se activa solo cuando el trigger cambia desde 0
      console.log("Limpiando caché de API...");
      marcasCache.current = {};
      modelosCache.current = {};
      anosCache.current = {};
      // Opcional: Forzar recarga de datos iniciales si es necesario,
      // pero al limpiar la caché, los efectos de carga se activarán solos
      // al cambiar de selección.
    }
  }, [cacheClearTrigger]);

  // Nuevo estado para controlar la consulta manual
  const [consultaPendiente, setConsultaPendiente] = useState(false);

  // Histórico de consultas
  const [historico, setHistorico] = useState<Array<{tipo: string, marca: string, modelo: string, ano: string, combustible: string}>>([]);

  const API_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

  // Cargar Marcas (con caché)
  useEffect(() => {
    if (!tipoVehiculo) return;
    if (marcasCache.current[tipoVehiculo]) {
      setMarcas(marcasCache.current[tipoVehiculo]);
      return;
    }
    const fetchMarcas = async () => {
      setLoadingMarcas(true);
      setErrorMarcas(null);
      setMarcas([]);
      setSelectedMarca(null);
      setMarcaSearchTerm('');
      setModelos([]);
      setSelectedModelo(null);
      setAnosDisponibles([]);
      setSelectedAno(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas`);
        if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar marcas.`);
        const data = await response.json();
        setMarcas(data);
        marcasCache.current[tipoVehiculo] = data;
      } catch (err: any) {
        setErrorMarcas(err.message);
      } finally {
        setLoadingMarcas(false);
      }
    };
    fetchMarcas();
  }, [tipoVehiculo]);

  // Cargar Modelos (con caché y preparado para filtrado futuro)
  useEffect(() => {
    if (!selectedMarca) {
      setModelos([]);
      setSelectedModelo(null);
      setAnosDisponibles([]);
      setSelectedAno(null);
      return;
    }
    const cacheKey = `${tipoVehiculo}-${selectedMarca.codigo}`;
    if (modelosCache.current[cacheKey]) {
      setModelos(modelosCache.current[cacheKey]);
      return;
    }
    const fetchModelos = async () => {
      setLoadingModelos(true);
      setErrorModelos(null);
      setModelos([]);
      setSelectedModelo(null);
      setAnosDisponibles([]);
      setSelectedAno(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas/${selectedMarca.codigo}/modelos`);
        if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar modelos.`);
        const data: ApiResponseModelos = await response.json();
        setModelos(data.modelos);
        // Guardar en caché para futuros filtrados
        modelosCache.current[cacheKey] = data.modelos;
      } catch (err: any) {
        setErrorModelos(err.message);
      } finally {
        setLoadingModelos(false);
      }
    };
    fetchModelos();
  }, [selectedMarca, tipoVehiculo]);

  // Cargar Años del Modelo (con caché)
  useEffect(() => {
    if (!selectedModelo) {
      setAnosDisponibles([]);
      setSelectedAno(null);
      return;
    }
    const cacheKey = `${tipoVehiculo}-${selectedMarca?.codigo}-${selectedModelo.codigo}`;
    if (anosCache.current[cacheKey]) {
      setAnosDisponibles(anosCache.current[cacheKey]);
      return;
    }
    const fetchAnos = async () => {
      setLoadingAnos(true);
      setErrorAnos(null);
      setAnosDisponibles([]);
      setSelectedAno(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas/${selectedMarca?.codigo}/modelos/${selectedModelo.codigo}/anos`);
        if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar años.`);
        const data = await response.json();
        setAnosDisponibles(data);
        anosCache.current[cacheKey] = data;
      } catch (err: any) {
        setErrorAnos(err.message);
      } finally {
        setLoadingAnos(false);
      }
    };
    fetchAnos();
  }, [selectedModelo, selectedMarca, tipoVehiculo]);

  // Cargar Valor FIPE del Vehículo (solo al hacer click en Consultar)
  useEffect(() => {
    if (!consultaPendiente) return;
    if (!selectedAno) {
      setVehiculoFipe(null);
      setConsultaPendiente(false);
      return;
    }
    const fetchVehiculo = async () => {
      setLoadingVehiculo(true);
      setErrorVehiculo(null);
      setVehiculoFipe(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas/${selectedMarca?.codigo}/modelos/${selectedModelo?.codigo}/anos/${selectedAno.codigo}`);
        if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar valor del vehículo.`);
        const data = await response.json();
        setVehiculoFipe(data);
      } catch (err: any) {
        setErrorVehiculo(err.message);
      } finally {
        setLoadingVehiculo(false);
        setConsultaPendiente(false);
      }
    };
    fetchVehiculo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultaPendiente]);

  // Guardar en histórico tras consulta exitosa
  useEffect(() => {
    if (vehiculoFipe && selectedMarca && selectedModelo && selectedAno) {
      const { ano, combustible } = extraerAnoComb(selectedAno.nome);
      const nuevo = { tipo: tipoVehiculo, marca: selectedMarca.nome, modelo: selectedModelo.nome, ano, combustible };
      // POST al backend
      fetch('http://localhost:4000/historico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      });
      setHistorico(prev => [nuevo, ...prev]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiculoFipe]);

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoVehiculo(e.target.value as TipoVehiculoAPI);
  };

  const handleMarcaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const marcaCodigo = e.target.value;
    const marcaSeleccionada = marcas.find(m => m.codigo === marcaCodigo);
    setSelectedMarca(marcaSeleccionada || null);
  };

  const handleModeloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelo = modelos.find(m => m.codigo.toString() === e.target.value);
    setSelectedModelo(modelo || null);
  };

  const handleAnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ano = anosDisponibles.find(a => a.codigo === e.target.value);
    setSelectedAno(ano || null);
  };

  const filteredMarcas = marcas.filter(marca => 
    marca.nome.toLowerCase().includes(marcaSearchTerm.toLowerCase())
  );

  // Clases comunes para los selectores para mantener consistencia
  const selectInputClasses = "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-500";
  const searchInputClasses = "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2";

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      {/* Cabecera (opcional, similar a la imagen de ejemplo) */}
      <header className="bg-gray-800 text-white p-4 shadow-md w-full">
        <h1 className="text-2xl font-bold">Consulta FIPE</h1>
        {/* Aquí podrían ir otros elementos de navegación como en la imagen */}
      </header>

      {/* Contenedor principal: Sidebar + Área de Contenido */}
      <div className="flex flex-1 p-4 gap-4 w-full h-full">
        <SidebarFiltros
          tipoVehiculo={tipoVehiculo}
          setTipoVehiculo={setTipoVehiculo}
          marcas={marcas}
          selectedMarca={selectedMarca}
          setSelectedMarca={setSelectedMarca}
          loadingMarcas={loadingMarcas}
          errorMarcas={errorMarcas}
          marcaSearchTerm={marcaSearchTerm}
          setMarcaSearchTerm={setMarcaSearchTerm}
          modelos={modelos}
          selectedModelo={selectedModelo}
          setSelectedModelo={setSelectedModelo}
          loadingModelos={loadingModelos}
          errorModelos={errorModelos}
          anosDisponibles={anosDisponibles}
          selectedAno={selectedAno}
          setSelectedAno={setSelectedAno}
          loadingAnos={loadingAnos}
          errorAnos={errorAnos}
          onConsultar={() => setConsultaPendiente(true)}
          disableConsultar={!selectedAno || loadingVehiculo}
          loadingConsultar={loadingVehiculo}
          historico={historico}
        />
        <div className="flex flex-col w-3/4">
          <ResultadoConsulta
            vehiculoFipe={vehiculoFipe}
            loadingVehiculo={loadingVehiculo}
            errorVehiculo={errorVehiculo}
            selectedAno={selectedAno}
            traducirMesReferencia={traducirMesReferencia}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Cargar histórico desde localStorage al iniciar
  const [historico, setHistorico] = useState<Array<{tipo: string, marca: string, modelo: string, ano: string, combustible: string}>>(() => {
    const data = localStorage.getItem('historico_fipe');
    return data ? JSON.parse(data) : [];
  });

  // Guardar histórico en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('historico_fipe', JSON.stringify(historico));
  }, [historico]);

  // Estado y función para el trigger de limpieza de caché
  const [cacheClearTrigger, setCacheClearTrigger] = useState(0);
  const triggerCacheClear = () => {
    console.log("Disparando limpieza de caché...");
    setCacheClearTrigger(prev => prev + 1); // Incrementar para disparar el efecto
  };

  return (
    <CacheContext.Provider value={{ cacheClearTrigger, triggerCacheClear }}>
      <Router>
        <ErrorBoundary>
          <div className="flex min-h-screen w-full bg-gray-100">
            <SidebarNav />
            <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
              <header className="bg-gray-800 text-white p-4 shadow-md w-full flex items-center justify-end">
                <nav>
                  <Link to="/" className="mr-4 hover:underline">Inicio</Link>
                  <Link to="/about" className="hover:underline">Acerca de</Link>
                </nav>
              </header>
              <main className="flex-1 w-full flex flex-row gap-8 p-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/historico" element={<HistoricoPage />} />
                  <Route path="*" element={<div className='flex flex-col items-center justify-center h-full p-8'><h2 className='text-2xl font-bold mb-4'>404 - Página no encontrada</h2></div>} />
                </Routes>
              </main>
            </div>
          </div>
        </ErrorBoundary>
      </Router>
    </CacheContext.Provider>
  );
}

// función extraerAnoComb para uso en App
function extraerAnoComb(nombre: string) {
  const match = nombre.match(/^(\d{4})(.*)$/);
  if (match) {
    const yearNum = parseInt(match[1], 10);
    if (!isNaN(yearNum) && yearNum <= 2300) {
      return {
        ano: match[1],
        combustible: match[2].trim(),
      };
    }
    return { ano: '', combustible: nombre.trim() };
  }
  return { ano: '', combustible: nombre.trim() };
}

export const HistoricoContext = createContext<{
  historico: Array<{tipo: string, marca: string, modelo: string, ano: string, combustible: string}>;
  setHistorico: React.Dispatch<React.SetStateAction<Array<{tipo: string, marca: string, modelo: string, ano: string, combustible: string}>>>;
} | undefined>(undefined);
