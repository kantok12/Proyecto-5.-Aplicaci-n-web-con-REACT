import React, { useMemo, useEffect } from 'react';

interface Marca {
  codigo: string;
  nome: string;
}
interface Modelo {
  codigo: number;
  nome: string;
}
interface AnoValor {
  codigo: string;
  nome: string;
}

type TipoVehiculoAPI = 'carros' | 'motos' | 'caminhoes';

interface SidebarFiltrosProps {
  tipoVehiculo: TipoVehiculoAPI;
  setTipoVehiculo: (tipo: TipoVehiculoAPI) => void;
  marcas: Marca[];
  selectedMarca: Marca | null;
  setSelectedMarca: (marca: Marca | null) => void;
  loadingMarcas: boolean;
  errorMarcas: string | null;
  marcaSearchTerm: string;
  setMarcaSearchTerm: (term: string) => void;
  modelos: Modelo[];
  selectedModelo: Modelo | null;
  setSelectedModelo: (modelo: Modelo | null) => void;
  loadingModelos: boolean;
  errorModelos: string | null;
  anosDisponibles: AnoValor[];
  selectedAno: AnoValor | null;
  setSelectedAno: (ano: AnoValor | null) => void;
  loadingAnos: boolean;
  errorAnos: string | null;
  onConsultar: () => void;
  disableConsultar: boolean;
  loadingConsultar: boolean;
}

// Actualizar clases de inputs/selects para tema oscuro
const selectInputClasses = "mt-1 block w-full py-2 px-3 border border-gray-500 bg-gray-600 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-500 disabled:text-gray-400";
const searchInputClasses = "mt-1 block w-full py-2 px-3 border border-gray-500 bg-gray-600 text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2 placeholder-gray-400";

export default function SidebarFiltros(props: SidebarFiltrosProps) {
  const filteredMarcas = props.marcas.filter(marca => 
    marca.nome.toLowerCase().includes(props.marcaSearchTerm.toLowerCase())
  );

  // Extra: función para extraer año y combustible
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

  // Detectar tipo de combustible sugerido por el modelo
  const modeloSugeridoDiesel = props.selectedModelo && /\(diesel\)/i.test(props.selectedModelo.nome);

  // Agrupar años y combustibles
  const anosAgrupados = useMemo(() => {
    const agrupado: { [ano: string]: string[] } = {};
    props.anosDisponibles.forEach(a => {
      const { ano, combustible } = extraerAnoComb(a.nome);
      if (ano) {
        if (!agrupado[ano]) agrupado[ano] = [];
        agrupado[ano].push(combustible || '');
      }
    });
    return agrupado;
  }, [props.anosDisponibles]);

  // Estado local para año y combustible seleccionados
  const selectedAnoValue = props.selectedAno ? extraerAnoComb(props.selectedAno.nome).ano : '';
  const selectedCombustibleValue = props.selectedAno ? extraerAnoComb(props.selectedAno.nome).combustible : '';

  // Opciones de años
  const anosOptions = Object.keys(anosAgrupados);
  // Opciones de combustibles para el año seleccionado
  const combustiblesOptions = selectedAnoValue ? anosAgrupados[selectedAnoValue] : [];

  // Efecto para preseleccionar combustible sugerido al cambiar modelo o año
  useEffect(() => {
    if (!selectedAnoValue || combustiblesOptions.length === 0) return;
    // Si ya hay un combustible seleccionado válido, no hacer nada
    if (combustiblesOptions.includes(selectedCombustibleValue)) return;
    // Buscar sugerido
    let sugerido = '';
    if (modeloSugeridoDiesel) {
      sugerido = combustiblesOptions.find(c => /diesel/i.test(c)) || '';
    } else {
      sugerido = combustiblesOptions.find(c => /gasolina/i.test(c)) || combustiblesOptions[0] || '';
    }
    if (sugerido) {
      // Buscar el objeto año+combustible
      const anoObj = props.anosDisponibles.find(a => {
        const parsed = extraerAnoComb(a.nome);
        return parsed.ano === selectedAnoValue && parsed.combustible === sugerido;
      });
      if (anoObj) props.setSelectedAno(anoObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedModelo, selectedAnoValue, combustiblesOptions.length]);

  // Handler para seleccionar año (ahora único filtro)
  function handleAnoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const year = e.target.value;
    // Buscar el primer año disponible con ese valor
    const anoObj = props.anosDisponibles.find(a => extraerAnoComb(a.nome).ano === year);
    props.setSelectedAno(anoObj || null);
  }
  // Handler para seleccionar marca
  function handleMarcaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const marcaCodigo = e.target.value;
    const marcaSeleccionada = props.marcas.find(m => m.codigo === marcaCodigo);
    props.setSelectedMarca(marcaSeleccionada || null);
    // Reiniciar modelo y año
    props.setSelectedModelo(null);
    props.setSelectedAno(null);
    if (props.errorAnos) props.errorAnos = null;
  }
  // Handler para seleccionar modelo
  function handleModeloChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const modelo = props.modelos.find(m => m.codigo.toString() === e.target.value);
    props.setSelectedModelo(modelo || null);
    // Reiniciar año
    props.setSelectedAno(null);
    if (props.errorAnos) props.errorAnos = null;
  }

  // Filtro local de modelos usando el caché
  const filteredModelos = useMemo(() => {
    if (!props.modelos || props.modelos.length === 0) return [];
    if (!props.marcaSearchTerm) return props.modelos;
    return props.modelos.filter(m => m.nome.toLowerCase().includes(props.marcaSearchTerm.toLowerCase()));
  }, [props.modelos, props.marcaSearchTerm]);

  return (
    <aside className="w-1/4 bg-gray-700 p-6 rounded-lg shadow-lg space-y-6 h-full flex flex-col justify-between">
      {/* Botón Consultar en la parte superior */}
      <button
        className="mb-4 w-full px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:bg-gray-500 flex items-center justify-center gap-2"
        onClick={props.onConsultar}
        disabled={props.disableConsultar}
      >
        {props.loadingConsultar && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        )}
        {props.loadingConsultar ? 'Consultando...' : 'Consultar'}
      </button>
      {/* Filtros */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* 1. Tipo de Vehículo */}
        <div>
          <label htmlFor="tipoVehiculo" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Vehículo</label>
          <select id="tipoVehiculo" value={props.tipoVehiculo} onChange={e => props.setTipoVehiculo(e.target.value as TipoVehiculoAPI)} className={selectInputClasses}>
            <option value="carros">Coches</option>
            <option value="motos">Motos</option>
            <option value="caminhoes">Camiones</option>
          </select>
        </div>
        {/* 2. Marcas */}
        <div>
          <label htmlFor="marcaSearch" className="block text-sm font-medium text-gray-300 mb-1">Buscar Marca</label>
          <input 
            type="text"
            id="marcaSearch"
            placeholder="Escriba para filtrar marcas..."
            value={props.marcaSearchTerm}
            onChange={e => props.setMarcaSearchTerm(e.target.value)}
            className={searchInputClasses}
          />
          <label htmlFor="marcas" className="block text-sm font-medium text-gray-300 mb-1 sr-only">Marca</label>
          {props.loadingMarcas && <p className="text-xs text-gray-400 italic">Cargando marcas...</p>}
          {props.errorMarcas && <p className="text-xs text-red-400 italic">{props.errorMarcas}</p>}
          <select 
            id="marcas" 
            value={props.selectedMarca?.codigo || ''} 
            onChange={handleMarcaChange} 
            disabled={props.loadingMarcas || filteredMarcas.length === 0}
            className={selectInputClasses}
          >
            <option value="" disabled={filteredMarcas.length > 0}>Seleccione una marca</option>
            {filteredMarcas.map(marca => <option key={marca.codigo} value={marca.codigo}>{marca.nome}</option>)}
          </select>
          {filteredMarcas.length === 0 && !props.loadingMarcas && props.marcas.length > 0 && (
            <p className="text-xs text-gray-400 italic mt-1">No se encontraron marcas con "{props.marcaSearchTerm}".</p>
          )}
        </div>
        {/* 3. Modelos */}
        {props.selectedMarca && (
          <div>
            <label htmlFor="modelos" className="block text-sm font-medium text-gray-300 mb-1">Modelo</label>
            {props.loadingModelos && <p className="text-xs text-gray-400 italic">Cargando modelos...</p>}
            {props.errorModelos && <p className="text-xs text-red-400 italic">{props.errorModelos}</p>}
            <select id="modelos" value={props.selectedModelo?.codigo || ''} onChange={handleModeloChange} disabled={props.loadingModelos || filteredModelos.length === 0} className={selectInputClasses}>
              <option value="" disabled={filteredModelos.length > 0}>Seleccione un modelo</option>
              {filteredModelos.map(modelo => <option key={modelo.codigo} value={modelo.codigo}>{modelo.nome}</option>)}
            </select>
          </div>
        )}
        {/* 4. Año (sin filtro de combustible) */}
        {props.selectedModelo && (
          <div>
            <label htmlFor="anos" className="block text-sm font-medium text-gray-300 mb-1">Año</label>
            {props.loadingAnos && <p className="text-xs text-gray-400 italic">Cargando años...</p>}
            {props.errorAnos && <p className="text-xs text-red-400 italic">{props.errorAnos}</p>}
            <select id="anos" value={selectedAnoValue} onChange={handleAnoChange} disabled={props.loadingAnos || anosOptions.length === 0} className={selectInputClasses}>
              <option value="" disabled={anosOptions.length > 0}>Seleccione año</option>
              {anosOptions.map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
            {/* Mostrar combustible solo como información */}
            {selectedAnoValue && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Combustible</label>
                <input
                  type="text"
                  className="block w-full py-2 px-3 border border-gray-500 bg-gray-500 text-gray-200 rounded-md shadow-sm sm:text-sm"
                  value={selectedCombustibleValue || 'N/A'}
                  readOnly
                />
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
} 