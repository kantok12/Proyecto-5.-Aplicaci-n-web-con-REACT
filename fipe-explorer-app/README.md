# FIPE Explorer App 🚗

Consulta el valor FIPE de vehículos en Brasil de manera sencilla, rápida y visual.

---

## Descripción

FIPE Explorer App es una aplicación web desarrollada con React + Vite que permite consultar el valor de referencia FIPE de autos, motos y camiones en Brasil. El usuario puede filtrar por tipo de vehículo, marca, modelo y año/combustible, obteniendo información actualizada y confiable.

---

## Características principales

- **Componentes funcionales y reutilizables**: Separación clara entre filtros y resultados.
- **Comunicación entre componentes usando props**.
- **Manejo de estado con `useState` y efectos con `useEffect`**.
- **Manejo de eventos en formularios y selectores**.
- **Rutas implementadas con React Router** (`/` para la consulta y `/about` para información).
- **Manejo de errores con Error Boundaries**.
- **Consumo de la API pública de FIPE**.
- **Estilos modernos y responsivos con TailwindCSS**.
- **Control de versiones con Git y múltiples commits**.
- **Despliegue sencillo en Netlify, Vercel o GitHub Pages**.

---

## Instalación y uso local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/fipe-explorer-app.git
   cd fipe-explorer-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en [http://localhost:5173](http://localhost:5173)

---

## ¿Cómo usar la app?

1. Selecciona el tipo de vehículo (auto, moto o camión).
2. Busca y selecciona la marca.
3. Selecciona el modelo y el año/combustible.
4. Visualiza el valor FIPE y detalles del vehículo.

---

## Estructura del proyecto

- `src/App.tsx`: Layout principal, rutas y navegación.
- `src/SidebarFiltros.tsx`: Componente de filtros y selectores.
- `src/ResultadoConsulta.tsx`: Componente para mostrar el resultado de la consulta.
- `src/ErrorBoundary.tsx`: Manejo de errores globales.
- `src/About.tsx`: Página informativa.
- `src/assets/`: Recursos estáticos.

---

## Tecnologías utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## Despliegue

Puedes desplegar la aplicación fácilmente en servicios como:
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)

Solo necesitas hacer un build con:
```bash
npm run build
```
Y subir la carpeta `dist` al servicio de tu preferencia.

---

## Requisitos cumplidos

- [x] Uso de Vite para la generación del proyecto.
- [x] Componentes funcionales y comunicación por props.
- [x] Manejo de estado con hooks (`useState`, `useEffect`).
- [x] Manejo de eventos en React.
- [x] Implementación de rutas con React Router.
- [x] Manejo de errores con Error Boundaries.
- [x] Consumo de una API pública y visualización de datos.
- [x] Implementación de estilos con TailwindCSS.
- [x] Control de versiones con Git y múltiples commits.
- [x] Archivo README con descripción, instalación y uso.
- [x] Listo para desplegar en servicios de terceros.

---

## Autor

Desarrollado por [Tu Nombre] como parte del curso/proyecto de React.

---

## Licencia

MIT
