import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Puedes loguear el error a un servicio externo aquí
    console.error('ErrorBoundary atrapó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-50">
          <h1 className="text-3xl font-bold text-red-700 mb-4">¡Algo salió mal!</h1>
          <p className="text-red-600 mb-2">{this.state.error?.message}</p>
          <button className="mt-4 px-4 py-2 bg-red-700 text-white rounded" onClick={() => window.location.reload()}>Recargar página</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 