import React from 'react';

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
}

const selectInputClasses = "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-500";
const searchInputClasses = "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2";

export default function SidebarFiltros(props: SidebarFiltrosProps) {
  const filteredMarcas = props.marcas.filter(marca => 
    marca.nome.toLowerCase().includes(props.marcaSearchTerm.toLowerCase())
  );

  return (
    <aside className="w-1/4 bg-white p-6 rounded-lg shadow-lg space-y-6 h-full">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Filtros</h2>
      {/* 1. Tipo de Vehículo */}
      <div>
        <label htmlFor="tipoVehiculo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
        <select id="tipoVehiculo" value={props.tipoVehiculo} onChange={e => props.setTipoVehiculo(e.target.value as TipoVehiculoAPI)} className={selectInputClasses}>
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
          value={props.marcaSearchTerm}
          onChange={e => props.setMarcaSearchTerm(e.target.value)}
          className={searchInputClasses}
        />
        <label htmlFor="marcas" className="block text-sm font-medium text-gray-700 mb-1 sr-only">Marca</label>
        {props.loadingMarcas && <p className="text-xs text-gray-500 italic">Cargando marcas...</p>}
        {props.errorMarcas && <p className="text-xs text-red-500 italic">{props.errorMarcas}</p>}
        <select 
          id="marcas" 
          value={props.selectedMarca?.codigo || ''} 
          onChange={e => {
            const marcaSeleccionada = props.marcas.find(m => m.codigo === e.target.value);
            props.setSelectedMarca(marcaSeleccionada || null);
          }}
          disabled={props.loadingMarcas || filteredMarcas.length === 0}
          className={selectInputClasses}
        >
          <option value="" disabled={filteredMarcas.length > 0}>Seleccione una marca</option>
          {filteredMarcas.map(marca => <option key={marca.codigo} value={marca.codigo}>{marca.nome}</option>)}
        </select>
        {filteredMarcas.length === 0 && !props.loadingMarcas && props.marcas.length > 0 && (
          <p className="text-xs text-gray-500 italic mt-1">No se encontraron marcas con "{props.marcaSearchTerm}".</p>
        )}
      </div>
      {/* 3. Modelos */}
      {props.selectedMarca && (
        <div>
          <label htmlFor="modelos" className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
          {props.loadingModelos && <p className="text-xs text-gray-500 italic">Cargando modelos...</p>}
          {props.errorModelos && <p className="text-xs text-red-500 italic">{props.errorModelos}</p>}
          <select id="modelos" value={props.selectedModelo?.codigo || ''} onChange={e => {
            const modelo = props.modelos.find(m => m.codigo.toString() === e.target.value);
            props.setSelectedModelo(modelo || null);
          }} disabled={props.loadingModelos || props.modelos.length === 0} className={selectInputClasses}>
            <option value="" disabled={props.modelos.length > 0}>Seleccione un modelo</option>
            {props.modelos.map(modelo => <option key={modelo.codigo} value={modelo.codigo}>{modelo.nome}</option>)}
          </select>
        </div>
      )}
      {/* 4. Años del Modelo */}
      {props.selectedModelo && (
        <div>
          <label htmlFor="anos" className="block text-sm font-medium text-gray-700 mb-1">Año/Combustible</label>
          {props.loadingAnos && <p className="text-xs text-gray-500 italic">Cargando años...</p>}
          {props.errorAnos && <p className="text-xs text-red-500 italic">{props.errorAnos}</p>}
          <select id="anos" value={props.selectedAno?.codigo || ''} onChange={e => {
            const ano = props.anosDisponibles.find(a => a.codigo === e.target.value);
            props.setSelectedAno(ano || null);
          }} disabled={props.loadingAnos || props.anosDisponibles.length === 0} className={selectInputClasses}>
            <option value="" disabled={props.anosDisponibles.length > 0}>Seleccione año/comb.</option>
            {props.anosDisponibles.map(ano => <option key={ano.codigo} value={ano.codigo}>{ano.nome}</option>)}
          </select>
        </div>
      )}
    </aside>
  );
} 