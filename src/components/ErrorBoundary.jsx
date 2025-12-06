import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Oops! Terjadi Kesalahan
            </h1>
            <p className="text-gray-600 mb-6">
              Maaf, aplikasi mengalami masalah. Silakan refresh halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Refresh Halaman
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Detail Error (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
