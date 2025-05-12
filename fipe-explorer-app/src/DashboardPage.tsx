import { useContext, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoricoContext } from './App';
import type { HistoricoItem } from './types'; // Importar desde types.ts

// Colores para el gráfico de dona (estos suelen funcionar bien en temas oscuros)
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// Función para traducir los tipos de vehículo de la API a español
const traducirTipoVehiculo = (tipoApi: string): string => {
  const traducciones: { [key: string]: string } = {
    carros: 'Coches',
    motos: 'Motos',
    caminhoes: 'Camiones',
  };
  return traducciones[tipoApi.toLowerCase()] || tipoApi; // Devuelve original si no hay traducción
};

export default function DashboardPage() {
  // Obtener datos y estado del contexto
  const { historico, loadingHistorico, errorHistorico } = useContext(HistoricoContext);

  // Procesamiento de datos para el dashboard
  const dashboardData = useMemo(() => {
    if (!historico || historico.length === 0) {
      return {
        consultasPorTipo: [],
        vehiculoMasConsultadoItem: null as HistoricoItem | null,
        vehiculoMasConsultadoCount: 0,
        ultimasConsultas: [],
        totalConsultas: 0,
      };
    }

    // 1. Consultas por tipo de vehículo (para el gráfico de dona)
    const tipoCounts: { [key: string]: number } = {};
    historico.forEach(item => {
      tipoCounts[item.tipo] = (tipoCounts[item.tipo] || 0) + 1;
    });
    const consultasPorTipo = Object.entries(tipoCounts).map(([name, value]) => ({ name: traducirTipoVehiculo(name), value }));

    // 2. Modelo más consultado (contando combinaciones únicas de tipo-marca-modelo-año)
    const modeloCounts: { [key: string]: { item: HistoricoItem; count: number } } = {};
    historico.forEach(item => {
      const key = `${item.tipo}-${item.marca}-${item.modelo}-${item.ano}`;
      if (!modeloCounts[key]) {
        modeloCounts[key] = { item, count: 0 };
      }
      modeloCounts[key].count++;
    });
    
    let vehiculoMasConsultadoItem: HistoricoItem | null = null;
    let vehiculoMasConsultadoCount = 0;
    Object.values(modeloCounts).forEach(data => {
      if (data.count > vehiculoMasConsultadoCount) {
        vehiculoMasConsultadoCount = data.count;
        vehiculoMasConsultadoItem = data.item;
      }
    });

    // 3. Últimas 5 consultas (asumiendo que el backend las devuelve en orden cronológico inverso o las más recientes primero)
    // Si no, necesitaríamos una marca de tiempo para ordenar.
    // Por ahora, tomamos las primeras 5 tal como vienen del backend si el backend las ordena.
    // Si el backend no las ordena, podemos invertir el array del frontend antes de tomar las primeras 5.
    const ultimasConsultas = [...historico].reverse().slice(0, 5); // Tomamos las últimas 5 después de invertir

    return {
      consultasPorTipo,
      vehiculoMasConsultadoItem,
      vehiculoMasConsultadoCount,
      ultimasConsultas,
      totalConsultas: historico.length,
    };
  }, [historico]);

  if (loadingHistorico) {
    return <div className="w-full p-8 flex justify-center items-center h-full"><p className="text-xl text-gray-300">Cargando datos del Dashboard...</p></div>;
  }

  if (errorHistorico) {
    return <div className="w-full p-8 flex justify-center items-center h-full"><p className="text-xl text-red-400">Error cargando histórico: {errorHistorico}</p></div>;
  }

  if (historico.length === 0 && !loadingHistorico) {
     return <div className="w-full p-8 flex justify-center items-center h-full"><p className="text-xl text-gray-400">No hay datos en el histórico para mostrar.</p></div>;
  }

  // Variable intermedia para asegurar el tipo antes del JSX
  const vehiculoTop = dashboardData.vehiculoMasConsultadoItem;

  return (
    <div className="w-full p-6 flex flex-col gap-6 h-full bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-100 shrink-0">Dashboard de Consultas FIPE</h2>
      
      {/* Fila Superior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total de Consultas */}
        <div className="md:col-span-1 bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Total de Consultas</h3>
          <p className="text-5xl font-bold text-blue-400">{dashboardData.totalConsultas}</p>
        </div>
        {/* Consultas por Tipo de Vehículo */}
        <div className="md:col-span-2 bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col">
          <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">Consultas por Tipo</h3>
          {dashboardData.consultasPorTipo.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardData.consultasPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {dashboardData.consultasPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '4px' }} itemStyle={{ color: '#E5E7EB' }}/>
                <Legend wrapperStyle={{fontSize: '14px', color: '#D1D5DB'}}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 flex-grow flex items-center justify-center">No hay datos para el gráfico.</p>
          )}
        </div>
      </div>

      {/* Fila Inferior - Ajuste de alineación de títulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* Vehículo Más Consultado */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col">
          {/* Título alineado a la izquierda */}
          <h3 className="text-xl font-semibold text-gray-200 mb-4 shrink-0">Vehículo Más Consultado</h3> 
          {vehiculoTop ? (
            /* Contenido con padding superior, sin centrado vertical forzado */
            <div className="text-center flex-grow pt-4"> 
              <p className="text-2xl font-bold text-indigo-400">
                {vehiculoTop.marca} - {vehiculoTop.modelo}
              </p>
              <p className="text-lg text-gray-300">Año: {vehiculoTop.ano}</p>
              <p className="text-md text-gray-400">
                ({dashboardData.vehiculoMasConsultadoCount} consultas)
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-400 flex-grow flex items-center justify-center">No se pudo determinar.</p>
          )}
        </div>

        {/* Últimas Consultas */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg flex flex-col">
           {/* Título alineado a la izquierda (ya estaba así) */}
          <h3 className="text-xl font-semibold text-gray-200 mb-4 shrink-0">Últimas 5 Consultas</h3>
          {dashboardData.ultimasConsultas.length > 0 ? (
            <div className="overflow-y-auto flex-grow" style={{maxHeight: '300px'}}>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-600 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-300">Tipo</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-300">Vehículo</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.ultimasConsultas.map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-600 hover:bg-gray-600">
                      <td className="px-3 py-2 text-gray-200 capitalize">{traducirTipoVehiculo(item.tipo)}</td>
                      <td className="px-3 py-2 text-gray-200">{item.marca} {item.modelo} ({item.ano})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-400 flex-grow flex items-center justify-center">No hay consultas recientes.</p>
          )}
        </div>
      </div>
    </div>
  );
} 