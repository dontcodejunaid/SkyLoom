import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SkyLoom runtime error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center">
          <div className="glass max-w-md p-8 rounded-3xl space-y-4">
            <div className="text-4xl">🌤️</div>
            <h2 className="text-2xl font-bold">SkyLoom Dashboard</h2>
            <p className="text-white/60 text-sm">A temporary issue occurred while loading. Please refresh to restore live weather data.</p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 font-semibold rounded-full text-slate-900 transition-all text-sm shadow-lg shadow-sky-500/30"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
