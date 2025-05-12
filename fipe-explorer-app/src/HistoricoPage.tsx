import { useEffect, useState, useContext } from 'react';
import { CacheContext } from './App'; // Importaremos el contexto desde App.tsx

export default function HistoricoPage() {
  const [historico, setHistorico] = useState<any[]>([]);
  const { triggerCacheClear } = useContext(CacheContext);

  useEffect(() => {
    fetch('http://localhost:4000/historico')
      .then(res => res.json())
      .then(data => setHistorico(data))
      .catch(() => setHistorico([]));
  }, []);

  return (
    <div className="w-full p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold">Histórico de Consultas</h2>
        <button 
          onClick={triggerCacheClear}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          Reiniciar Cache API
        </button>
      </div>
      <div className="overflow-auto flex-grow">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white rounded shadow">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 font-semibold">Tipo</th>
              <th className="px-3 py-2 font-semibold">Marca</th>
              <th className="px-3 py-2 font-semibold">Modelo</th>
              <th className="px-3 py-2 font-semibold">Año</th>
            </tr>
          </thead>
          <tbody>
            {historico && historico.length > 0 ? (
              historico
                .filter(item => item && typeof item === 'object' && item.tipo)
                .map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-2">{item.tipo}</td>
                    <td className="px-3 py-2">{item.marca}</td>
                    <td className="px-3 py-2">{item.modelo}</td>
                    <td className="px-3 py-2">{item.ano}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">No hay resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 