import { useContext } from 'react';
import { CacheContext } from './App';
import { HistoricoContext } from './App';
import type { HistoricoItem } from './types';

export default function HistoricoPage() {
  const { historico, loadingHistorico, errorHistorico } = useContext(HistoricoContext);
  const { triggerCacheClear } = useContext(CacheContext);

  if (loadingHistorico) {
    return <div className="w-full p-8 flex justify-center items-center h-full"><p className="text-xl text-gray-300">Cargando histórico...</p></div>;
  }

  if (errorHistorico) {
    return <div className="w-full p-8 flex justify-center items-center h-full"><p className="text-xl text-red-400">Error al cargar el histórico: {errorHistorico}</p></div>;
  }

  return (
    <div className="w-full p-4 flex flex-col h-full bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-gray-100">Histórico de Consultas</h2>
        <button 
          onClick={triggerCacheClear}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          Reiniciar Cache API (Filtros)
        </button>
      </div>
      <div className="overflow-auto flex-grow">
        {historico && historico.length > 0 ? (
          <table className="min-w-full text-sm text-left text-gray-200 bg-gray-700 rounded shadow">
            <thead className="bg-gray-600 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 font-semibold">Tipo</th>
                <th className="px-3 py-2 font-semibold">Marca</th>
                <th className="px-3 py-2 font-semibold">Modelo</th>
                <th className="px-3 py-2 font-semibold">Año</th>
              </tr>
            </thead>
            <tbody>
              {historico
                .filter(item => item && typeof item === 'object' && item.tipo && item.marca && item.modelo && item.ano)
                .map((item: HistoricoItem, idx: number) => (
                  <tr key={idx} className="border-t border-gray-600">
                    <td className="px-3 py-2 capitalize">{item.tipo}</td>
                    <td className="px-3 py-2">{item.marca}</td>
                    <td className="px-3 py-2">{item.modelo}</td>
                    <td className="px-3 py-2">{item.ano}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="flex-grow flex justify-center items-center">
            <p className="text-xl text-gray-400">No hay consultas en el histórico.</p>
          </div>
        )}
      </div>
    </div>
  );
} 