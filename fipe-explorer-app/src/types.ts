// src/types.ts

// Definimos un tipo para las marcas para mayor claridad con TypeScript
export interface Marca {
  codigo: string;
  nome: string;
}

export interface Modelo {
  codigo: number; // La API devuelve el código de modelo como número
  nome: string;
}

export interface ApiResponseModelos {
  modelos: Modelo[];
  anos: { codigo: string; nome: string }[]; // Incluimos 'anos' aunque no lo usemos activamente ahora
}

export interface AnoValor {
  codigo: string; // ej: "2015-1" (gasolina), "2020-3" (diesel)
  nome: string;   // ej: "2015 Gasolina", "2020 Diesel"
}

export interface VehiculoFipe {
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
export type TipoVehiculoAPI = 'carros' | 'motos' | 'caminhoes';

// Interfaz para los ítems del histórico GLOBAL
export interface HistoricoItem {
  tipo: TipoVehiculoAPI | string; // string para flexibilidad, pero idealmente TipoVehiculoAPI
  marca: string;
  modelo: string;
  ano: string;
  // combustible ya no es un filtro principal, se puede omitir o hacer opcional si se guarda
} 