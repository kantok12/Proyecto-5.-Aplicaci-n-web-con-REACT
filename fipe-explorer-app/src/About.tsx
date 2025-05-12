export default function About() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h2 className="text-2xl font-bold mb-4">Acerca de la Consulta FIPE</h2>
      <p className="text-lg text-gray-700 max-w-xl text-center">
        Esta aplicación permite consultar el valor FIPE de vehículos en Brasil usando la API pública de FIPE. Fue desarrollada como proyecto de aprendizaje en React, implementando hooks, manejo de estado, rutas y manejo de errores.
      </p>
    </div>
  );
} 