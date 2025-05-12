import { Link, useLocation } from 'react-router-dom';

export default function SidebarNav() {
  const location = useLocation();
  const linkClasses = (path: string) => 
    `py-2 px-4 rounded text-center font-semibold transition-colors text-white ${location.pathname === path ? 'bg-blue-600' : 'bg-gray-800 hover:bg-blue-700'}`;

  return (
    <aside
      className="h-screen w-[220px] bg-gray-900 text-white flex flex-col items-center py-8 fixed left-0 top-0 z-20 shadow-lg"
      style={{ minWidth: 220 }}
    >
      <h1 className="text-xl font-bold mb-8">FIPE Explorer</h1>
      <nav className="flex flex-col gap-4 w-full px-4">
        <Link to="/dashboard" className={linkClasses('/dashboard')}>
          Dashboard
        </Link>
        <Link to="/" className={linkClasses('/')}>
          Consulta
        </Link>
        <Link to="/historico" className={linkClasses('/historico')}>
          Histórico
        </Link>
      </nav>
    </aside>
  );
} 