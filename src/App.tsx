import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AnimatedRoutes from './components/AnimatedRoutes';
import { Marca, Modelo, Ano, HistoricoItem, TipoVehiculo, ValoracionInput } from './types';

// Definición de la URL de la API, usando la variable de entorno
// ... existing code ...
// Aquí estaban las definiciones de tipo movidas a src/types.ts

// Interfaz para el componente de valoración (si es diferente de HistoricoItem)
// interface ValoracionInput {
//   mesReferencia: string;
//   codigoFipe: string;
//   marca: string;
//   modelo: string;
//   anoModelo: number;
//   combustivel: string;
//   valor: string;
//   tipoVehiculo: TipoVehiculo;
// }


// Funciones de ayuda que podrían estar aquí o en un archivo utils.ts
// const traducirTipoVehiculo = (tipo: TipoVehiculo): string => {
//   switch (tipo) {
//     case 1: return 'carro';
//     case 2: return 'moto';
//     case 3: return 'caminhao';
//     default: return 'desconhecido';
//   }
// };

// Funcion para traducir el mes de referencia si es necesario
// function traducirMesReferencia(mes: string): string {
//   const partes = mes.split(' de ');
//   if (partes.length === 2) {
//     const mesTexto = partes[0].toLowerCase();
//     const ano = partes[1];
//     const meses: { [key: string]: string } = {
//       janeiro: 'January',
//       fevereiro: 'February',
//       março: 'March',
//       abril: 'April',
//       maio: 'May',
//       junho: 'June',
//       julho: 'July',
//       agosto: 'August',
//       setembro: 'September',
//       outubro: 'October',
//       novembro: 'November',
//       dezembro: 'December',
//     };
//     return `${meses[mesTexto] || partes[0]} de ${ano}`;
//   }
//   return mes;
// }


// Estado para el tipo de vehículo seleccionado (carro, moto, caminhao)
// const [tipoVehiculo, setTipoVehiculo] = useState<TipoVehiculo>(1); // Por defecto carros


// Estados para los filtros y resultados
// ... existing code ...
//   // }, [tipoVehiculo]); // Dependencia en tipoVehiculo para recargar marcas si cambia


//   // Funciones para manejar cambios en los filtros
// ... existing code ...
//   // };


//   // Función para consultar valor y añadir al histórico
//   const consultarValor = async () => {
//     if (!selectedMarca || !selectedModelo || !selectedAno) {
//       setError('Por favor, selecione marca, modelo e ano.');
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     setResultado(null);

//     try {
//       const anoComb = selectedAno.codigo.split('-');
//       const anoModelo = parseInt(anoComb[0]);
//       const codigoCombustivel = parseInt(anoComb[1]); // Esto puede no ser necesario si la API no lo usa explícitamente

//       // Ya no es necesario traducir, la API espera el código numérico del tipoVehiculo
//       const url = `${API_URL}/veiculo/${tipoVehiculo}/${selectedMarca.codigo}/${selectedModelo.codigo}/${selectedAno.codigo}/valor`;
//       console.log("Consultando URL:", url);

//       const response = await fetch(url);
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.mensagem || `Erro ao consultar valor: ${response.statusText}`);
//       }
//       const data = await response.json();
//       setResultado(data);

//       // Preparar datos para el histórico
//       const itemHistorico: HistoricoItem = {
//         id: Date.now().toString(), // ID único
//         fechaConsulta: new Date().toISOString(),
//         tipoVehiculo: tipoVehiculo, // Asegúrate que tipoVehiculo es del tipo correcto
//         marca: selectedMarca.nome,
//         modelo: selectedModelo.nome,
//         anoModelo: anoModelo, // Usar el año numérico
//         combustivel: data.Combustivel, // Asumiendo que la API devuelve esto
//         valor: data.Valor,
//         mesReferencia: data.MesReferencia,
//         codigoFipe: data.CodigoFipe,
//       };

//       // Enviar al backend para guardar en el histórico
//       // La URL del backend para guardar en el histórico se define como `${API_URL}/historico`
//       // Esta URL ahora incluirá la base de la API definida por VITE_API_URL
//       const postHistoricoUrl = `${API_URL}/historico`;
//       const postResponse = await fetch(postHistoricoUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(itemHistorico),
//       });

//       if (!postResponse.ok) {
//         const postErrorData = await postResponse.json();
//         throw new Error(postErrorData.mensagem || `Erro ao salvar no histórico: ${postResponse.statusText}`);
//       }
//       // Actualizar el estado del histórico local si es necesario o si no se recarga desde el backend
//       // setHistorico(prev => [...prev, itemHistorico]);


//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//         console.error("Erro na consulta de valor:", err);
//       } else {
//         setError("Ocorreu um erro desconhecido.");
//         console.error("Erro na consulta de valor (desconhecido):", err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Funcion para extraer el año y el tipo de combustible si es necesario
//   // function extraerAnoComb(anoCodigo: string): { ano: number, combustivelId?: string } {
//   //   const partes = anoCodigo.split('-');
//   //   return {
//   //     ano: parseInt(partes[0]),
//   //     combustivelId: partes[1] // puede ser undefined si no hay código de combustible
//   //   };
//   // }

//   return (
//     <Router>
// ... existing code ...


// ... existing code ... 