import { useState, useEffect, useRef, useContext } from 'react';
import { CacheContext, HistoricoContext } from './App'; // Importar contextos
import type { HistoricoItem, Marca, Modelo, ApiResponseModelos, AnoValor, VehiculoFipe, TipoVehiculoAPI } from './types'; // Importar tipos desde types.ts
import SidebarFiltros from './SidebarFiltros';
import ResultadoConsulta from './ResultadoConsulta';

// Función extraerAnoComb (necesaria aquí también, o importada si se movió a utils)
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

// Función traducirMesReferencia (necesaria aquí si ResultadoConsulta la usa)
const traducirMesReferencia = (mesReferenciaPT: string): string => {
  if (!mesReferenciaPT) return '';
  const [mesPT, anio] = mesReferenciaPT.toLowerCase().split(' de ');
  const mesesMap: { [key: string]: string } = { janeiro: 'enero', fevereiro: 'febrero', março: 'marzo', abril: 'abril', maio: 'mayo', junho: 'junio', julho: 'julio', agosto: 'agosto', setembro: 'septiembre', outubro: 'octubre', novembro: 'noviembre', dezembro: 'diciembre' };
  const mesES = mesesMap[mesPT] || mesPT;
  return `${mesES.charAt(0).toUpperCase() + mesES.slice(1)} de ${anio}`;
};


export default function HomePage() { // Cambiado a export default
  const [tipoVehiculo, setTipoVehiculo] = useState<TipoVehiculoAPI>('carros');
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [loadingMarcas, setLoadingMarcas] = useState<boolean>(false);
  const [errorMarcas, setErrorMarcas] = useState<string | null>(null);
  const [marcaSearchTerm, setMarcaSearchTerm] = useState('');
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
  const [consultaPendiente, setConsultaPendiente] = useState(false);

  const marcasCache = useRef<{ [tipo: string]: Marca[] }>({});
  const modelosCache = useRef<{ [key: string]: Modelo[] }>({});
  const anosCache = useRef<{ [key: string]: AnoValor[] }>({});

  const { cacheClearTrigger } = useContext(CacheContext);
  const { agregarAlHistorico } = useContext(HistoricoContext); 

  useEffect(() => {
    if (cacheClearTrigger > 0) {
      console.log("Limpiando caché de API (filtros)...");
      marcasCache.current = {};
      modelosCache.current = {};
      anosCache.current = {};
    }
  }, [cacheClearTrigger]);

  const API_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

  // Lógica de carga de Marcas, Modelos, Años (sin cambios)
  useEffect(() => { /* Fetch Marcas */
    if (!tipoVehiculo) return;
    if (marcasCache.current[tipoVehiculo]) { setMarcas(marcasCache.current[tipoVehiculo]); return; }
    const fetchMarcas = async () => {
      setLoadingMarcas(true); setErrorMarcas(null); setMarcas([]); setSelectedMarca(null); setMarcaSearchTerm(''); setModelos([]); setSelectedModelo(null); setAnosDisponibles([]); setSelectedAno(null); setVehiculoFipe(null);
      try {
        const r = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas`); if (!r.ok) throw new Error(`HTTP ${r.status}`); const d = await r.json(); setMarcas(d); marcasCache.current[tipoVehiculo] = d;
      } catch (e:any) { setErrorMarcas(e.message); } finally { setLoadingMarcas(false); }
    };
    fetchMarcas();
  }, [tipoVehiculo]);

  useEffect(() => { /* Fetch Modelos */
    if (!selectedMarca) { setModelos([]); setSelectedModelo(null); setAnosDisponibles([]); setSelectedAno(null); setVehiculoFipe(null); return; }
    const k = `${tipoVehiculo}-${selectedMarca.codigo}`; if (modelosCache.current[k]) { setModelos(modelosCache.current[k]); return; }
    const fetchModelos = async () => {
      setLoadingModelos(true); setErrorModelos(null); setModelos([]); setSelectedModelo(null); setAnosDisponibles([]); setSelectedAno(null); setVehiculoFipe(null);
      try {
        const r = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas/${selectedMarca.codigo}/modelos`); if (!r.ok) throw new Error(`HTTP ${r.status}`); const d: ApiResponseModelos = await r.json(); setModelos(d.modelos); modelosCache.current[k] = d.modelos;
      } catch (e:any) { setErrorModelos(e.message); } finally { setLoadingModelos(false); }
    };
    fetchModelos();
  }, [selectedMarca, tipoVehiculo]);

  useEffect(() => { /* Fetch Anos */
    if (!selectedModelo) { setAnosDisponibles([]); setSelectedAno(null); setVehiculoFipe(null); return; }
    const k = `${tipoVehiculo}-${selectedMarca?.codigo}-${selectedModelo.codigo}`; if (anosCache.current[k]) { setAnosDisponibles(anosCache.current[k]); return; }
    const fetchAnos = async () => {
      setLoadingAnos(true); setErrorAnos(null); setAnosDisponibles([]); setSelectedAno(null); setVehiculoFipe(null);
      try {
        const r = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas/${selectedMarca?.codigo}/modelos/${selectedModelo.codigo}/anos`); if (!r.ok) throw new Error(`HTTP ${r.status}`); const d = await r.json(); setAnosDisponibles(d); anosCache.current[k] = d;
      } catch (e:any) { setErrorAnos(e.message); } finally { setLoadingAnos(false); }
    };
    fetchAnos();
  }, [selectedModelo, selectedMarca, tipoVehiculo]);

  // Cargar Valor FIPE del Vehículo y guardar en histórico
  useEffect(() => {
    if (!consultaPendiente) return;
    if (!selectedAno || !selectedMarca || !selectedModelo) {
      setVehiculoFipe(null); setConsultaPendiente(false); return;
    }
    const fetchVehiculo = async () => {
      setLoadingVehiculo(true); setErrorVehiculo(null); setVehiculoFipe(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${tipoVehiculo}/marcas/${selectedMarca.codigo}/modelos/${selectedModelo.codigo}/anos/${selectedAno.codigo}`);
        if (!response.ok) throw new Error(`Error HTTP ${response.status} al cargar valor del vehículo.`);
        const data = await response.json();
        setVehiculoFipe(data);
        if (data) { // Guardar solo si la consulta fue exitosa
          const { ano } = extraerAnoComb(selectedAno.nome);
          const nuevoItemHistorico: HistoricoItem = { 
            tipo: tipoVehiculo,
            marca: selectedMarca.nome,
            modelo: selectedModelo.nome,
            ano: ano 
          };
          await agregarAlHistorico(nuevoItemHistorico);
        }
      } catch (err: any) { setErrorVehiculo(err.message); 
      } finally { setLoadingVehiculo(false); setConsultaPendiente(false); }
    };
    fetchVehiculo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultaPendiente]); // Dependencias correctas


  return (
    <div className="flex flex-1 gap-6 p-6 bg-gray-800"> {/* Changed bg-gray-100 to bg-gray-800 */}
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
      />
      <ResultadoConsulta
        vehiculoFipe={vehiculoFipe} 
        loadingVehiculo={loadingVehiculo} 
        errorVehiculo={errorVehiculo}
        selectedAno={selectedAno} 
        traducirMesReferencia={traducirMesReferencia}
      />
    </div>
  );
} 