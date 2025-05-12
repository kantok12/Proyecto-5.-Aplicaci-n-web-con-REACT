export default function About() {
  return (
    <div className="w-full p-8 flex flex-col items-center justify-center bg-gray-800 rounded-lg shadow-lg h-full text-gray-200">
      <div className="max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-gray-100 mb-8">Acerca de FIPE Explorer</h2>
        
        <p className="text-lg mb-6">
          Esta aplicación te permite consultar el valor FIPE de vehículos en Brasil directamente desde la API pública de FIPE (Fundación Instituto de Investigaciones Económicas).
        </p>
        
        <p className="text-lg mb-6">
          Ha sido desarrollada como un proyecto de aprendizaje en React, aplicando conceptos como:
        </p>
        
        <ul className="list-disc list-inside text-left mb-8 space-y-2 text-md">
          <li>Componentes funcionales y Hooks (useState, useEffect, useContext, useMemo, useRef).</li>
          <li>Manejo de estado avanzado y Context API para estado global.</li>
          <li>Enrutamiento con React Router DOM (v6).</li>
          <li>Interacción con APIs externas (fetch).</li>
          <li>Manejo de errores y Error Boundaries.</li>
          <li>Buenas prácticas de desarrollo y estructura de proyectos.</li>
          <li>Estilizado con Tailwind CSS para una interfaz moderna y responsive.</li>
          <li>Integración con un backend simple (Node.js/Express) para persistencia de datos.</li>
          <li>Creación de un Dashboard interactivo con visualización de datos.</li>
        </ul>
        
        <div className="mt-12 pt-8 border-t border-gray-600">
          <p className="text-md font-semibold text-gray-400">
            Un agradecimiento especial a la <span className="text-blue-400">Universidad del Desarrollo</span> por la oportunidad de realizar este proyecto.
          </p>
        </div>
      </div>
    </div>
  );
} 