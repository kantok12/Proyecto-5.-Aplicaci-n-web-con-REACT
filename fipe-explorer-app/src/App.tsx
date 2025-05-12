import { useState, useEffect } from 'react';
import './App.css';

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

function App() {
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

  const API_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

  // Cargar Marcas
  useEffect(() => {
    if (!tipoVehiculo) return;
    
    const fetchMarcas = async () => {
      setLoadingMarcas(true);
      setErrorMarcas(null);
      setMarcas([]);
      setSelectedMarca(null);
      setMarcaSearchTerm(''); // Resetear búsqueda de marca
      setModelos([]);
      setSelectedModelo(null);
      setAnosDisponibles([]);
      setSelectedAno(null);
      setVehiculoFipe(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas`);
        if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar marcas.`);
        const data = await response.json();
        setMarcas(data);
      } catch (err: any) {
        setErrorMarcas(err.message);
      } finally {
        setLoadingMarcas(false);
      }
    };
    fetchMarcas();
  }, [tipoVehiculo]);

  // Cargar Modelos
  useEffect(() => {
    if (!selectedMarca) {
      setModelos([]);
      setSelectedModelo(null);
      setAnosDisponibles([]);
      setSelectedAno(null);
      setVehiculoFipe(null);
      return;
    }
    const fetchModelos = async () => {
      setLoadingModelos(true);
      setErrorModelos(null);
      setModelos([]);
      setSelectedModelo(null);
      setAnosDisponibles([]);
      setSelectedAno(null);
      setVehiculoFipe(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas/${selectedMarca.codigo}/modelos`);
        if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar modelos.`);
        const data: ApiResponseModelos = await response.json();
        setModelos(data.modelos);
      } catch (err: any) {
        setErrorModelos(err.message);
      } finally {
        setLoadingModelos(false);
      }
    };
    fetchModelos();
  }, [selectedMarca, tipoVehiculo]);

  // Cargar Años del Modelo
  useEffect(() => {
    if (!selectedModelo) {
      setAnosDisponibles([]);
      setSelectedAno(null);
      setVehiculoFipe(null);
      return;
    }
    const fetchAnos = async () => {
      setLoadingAnos(true);
      setErrorAnos(null);
      setAnosDisponibles([]);
      setSelectedAno(null);
      setVehiculoFipe(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas/${selectedMarca?.codigo}/modelos/${selectedModelo.codigo}/anos`);
        if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar años.`);
        const data = await response.json();
        setAnosDisponibles(data);
      } catch (err: any) {
        setErrorAnos(err.message);
      } finally {
        setLoadingAnos(false);
      }
    };
    fetchAnos();
  }, [selectedModelo, selectedMarca, tipoVehiculo]);

  // Cargar Valor FIPE del Vehículo
  useEffect(() => {
    if (!selectedAno) {
      setVehiculoFipe(null);
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
      }
    };
    fetchVehiculo();
  }, [selectedAno, selectedModelo, selectedMarca, tipoVehiculo]);

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
  const selectInputClasses = "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-500";
  const searchInputClasses = "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Cabecera (opcional, similar a la imagen de ejemplo) */}
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Consulta FIPE</h1>
        {/* Aquí podrían ir otros elementos de navegación como en la imagen */}
      </header>

      {/* Contenedor principal: Sidebar + Área de Contenido */}
      <div className="flex flex-1 p-4 gap-4">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Filtros</h2>
          
          {/* 1. Tipo de Vehículo */}
          <div>
            <label htmlFor="tipoVehiculo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
            <select id="tipoVehiculo" value={tipoVehiculo} onChange={handleTipoChange} className={selectInputClasses}>
              <option value="carros">Coches</option>
              <option value="motos">Motos</option>
              <option value="caminhoes">Camiones</option>
            </select>
          </div>

          {/* 2. Marcas */}
          <div>
            <label htmlFor="marcaSearch" className="block text-sm font-medium text-gray-700 mb-1">Buscar Marca</label>
            <input 
              type="text"
              id="marcaSearch"
              placeholder="Escriba para filtrar marcas..."
              value={marcaSearchTerm}
              onChange={(e) => setMarcaSearchTerm(e.target.value)}
              className={searchInputClasses}
            />
            <label htmlFor="marcas" className="block text-sm font-medium text-gray-700 mb-1 sr-only">Marca</label> {/* sr-only para accesibilidad si el label visible es "Buscar Marca"*/}
            {loadingMarcas && <p className="text-xs text-gray-500 italic">Cargando marcas...</p>}
            {errorMarcas && <p className="text-xs text-red-500 italic">{errorMarcas}</p>}
            <select 
              id="marcas" 
              value={selectedMarca?.codigo || ''} 
              onChange={handleMarcaChange} 
              disabled={loadingMarcas || filteredMarcas.length === 0}
              className={selectInputClasses}
            >
              <option value="" disabled={filteredMarcas.length > 0}>Seleccione una marca</option>
              {filteredMarcas.map(marca => <option key={marca.codigo} value={marca.codigo}>{marca.nome}</option>)}
            </select>
            {filteredMarcas.length === 0 && !loadingMarcas && marcas.length > 0 && (
              <p className="text-xs text-gray-500 italic mt-1">No se encontraron marcas con "{marcaSearchTerm}".</p>
            )}
          </div>

          {/* 3. Modelos */}
          {selectedMarca && (
            <div>
              <label htmlFor="modelos" className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              {loadingModelos && <p className="text-xs text-gray-500 italic">Cargando modelos...</p>}
              {errorModelos && <p className="text-xs text-red-500 italic">{errorModelos}</p>}
              <select id="modelos" value={selectedModelo?.codigo || ''} onChange={handleModeloChange} disabled={loadingModelos || modelos.length === 0} className={selectInputClasses}>
                <option value="" disabled={modelos.length > 0}>Seleccione un modelo</option>
                {modelos.map(modelo => <option key={modelo.codigo} value={modelo.codigo}>{modelo.nome}</option>)}
              </select>
            </div>
          )}

          {/* 4. Años del Modelo */}
          {selectedModelo && (
            <div>
              <label htmlFor="anos" className="block text-sm font-medium text-gray-700 mb-1">Año/Combustible</label>
              {loadingAnos && <p className="text-xs text-gray-500 italic">Cargando años...</p>}
              {errorAnos && <p className="text-xs text-red-500 italic">{errorAnos}</p>}
              <select id="anos" value={selectedAno?.codigo || ''} onChange={handleAnoChange} disabled={loadingAnos || anosDisponibles.length === 0} className={selectInputClasses}>
                <option value="" disabled={anosDisponibles.length > 0}>Seleccione año/comb.</option>
                {anosDisponibles.map(ano => <option key={ano.codigo} value={ano.codigo}>{ano.nome}</option>)}
              </select>
            </div>
          )}
        </aside>

        {/* Área de Contenido Principal */}
        <main className="w-3/4 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Resultado de la Consulta</h2>
          {loadingVehiculo && <p className="text-lg text-gray-700 italic">Consultando valor FIPE...</p>}
          {errorVehiculo && <p className="text-lg text-red-600 bg-red-100 p-3 rounded-md">Error: {errorVehiculo}</p>}
          
          {vehiculoFipe && !loadingVehiculo && !errorVehiculo && (
            <div className="space-y-3 text-gray-800">
              <p><span className="font-semibold">Marca:</span> {vehiculoFipe.Marca}</p>
              <p><span className="font-semibold">Modelo:</span> {vehiculoFipe.Modelo}</p>
              <p><span className="font-semibold">Año del Modelo:</span> {vehiculoFipe.AnoModelo}</p>
              <p><span className="font-semibold">Combustible:</span> {vehiculoFipe.Combustivel}</p>
              <p className="text-3xl font-bold text-green-700 mt-4"><span className="font-semibold text-gray-800">Valor FIPE:</span> {vehiculoFipe.Valor}</p>
              <hr className="my-4"/>
              <p className="text-sm text-gray-600"><span className="font-semibold">Código FIPE:</span> {vehiculoFipe.CodigoFipe}</p>
              <p className="text-sm text-gray-600"><span className="font-semibold">Mes de Referencia:</span> {traducirMesReferencia(vehiculoFipe.MesReferencia)}</p>
            </div>
          )}

          {!selectedAno && !loadingVehiculo && !errorVehiculo && (
             <p className="text-gray-600 italic">Complete todos los filtros para ver el valor FIPE.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
