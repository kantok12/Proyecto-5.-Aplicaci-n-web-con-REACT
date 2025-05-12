import React from 'react';

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

interface ResultadoConsultaProps {
  vehiculoFipe: VehiculoFipe | null;
  loadingVehiculo: boolean;
  errorVehiculo: string | null;
  selectedAno: any;
  traducirMesReferencia: (mes: string) => string;
}

export default function ResultadoConsulta({ vehiculoFipe, loadingVehiculo, errorVehiculo, selectedAno, traducirMesReferencia }: ResultadoConsultaProps) {
  return (
    <main className="w-3/4 bg-gray-700 p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-600 pb-2 mb-4">Resultado de la Consulta</h2>
      {loadingVehiculo && <p className="text-lg text-gray-300 italic">Consultando valor FIPE...</p>}
      {errorVehiculo && <p className="text-lg text-red-300 bg-red-900 bg-opacity-50 p-3 rounded-md">Error: {errorVehiculo}</p>}
      {vehiculoFipe && !loadingVehiculo && !errorVehiculo && (
        <div className="space-y-3 text-gray-200">
          <p><span className="font-semibold">Marca:</span> {vehiculoFipe.Marca}</p>
          <p><span className="font-semibold">Modelo:</span> {vehiculoFipe.Modelo}</p>
          <p><span className="font-semibold">Año del Modelo:</span> {vehiculoFipe.AnoModelo}</p>
          <p><span className="font-semibold">Combustible:</span> {vehiculoFipe.Combustivel}</p>
          <p className="text-3xl font-bold text-green-400 mt-4"><span className="font-semibold text-gray-200">Valor FIPE:</span> {vehiculoFipe.Valor}</p>
          <hr className="my-4 border-gray-600"/>
          <p className="text-sm text-gray-400"><span className="font-semibold">Código FIPE:</span> {vehiculoFipe.CodigoFipe}</p>
          <p className="text-sm text-gray-400"><span className="font-semibold">Mes de Referencia:</span> {traducirMesReferencia(vehiculoFipe.MesReferencia)}</p>
        </div>
      )}
      {!selectedAno && !loadingVehiculo && !errorVehiculo && (
        <p className="text-gray-400 italic">Complete todos los filtros para ver el valor FIPE.</p>
      )}
    </main>
  );
} 