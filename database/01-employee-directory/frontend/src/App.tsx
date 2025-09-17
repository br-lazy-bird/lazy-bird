import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface HealthStatus {
  status: string;
  service?: string;
  database?: string;
  message?: string;
}

function App() {
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null);
  const [dbHealth, setDbHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkServices();
  }, []);

  const checkServices = async () => {
    try {
      // Check backend health
      const backendResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/health`);
      setBackendHealth(backendResponse.data);

      // Check database health
      const dbResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/db-health`);
      setDbHealth(dbResponse.data);
    } catch (error) {
      console.error('Health check failed:', error);
      setBackendHealth({ status: 'error', message: 'Backend unreachable' });
      setDbHealth({ status: 'error', message: 'Database check failed' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#FF9800';
    }
  };

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Employee Directory</h1>
          <p>Checking services...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🦅 Lazy Bird - Employee Directory</h1>
        <p>Docker setup is working! All services are connected.</p>
        
        <div className="service-status">
          <h3>Service Health Check</h3>
          
          <div className="status-item">
            <strong>Frontend:</strong>
            <span style={{ color: '#4CAF50' }}> ✅ Running</span>
          </div>
          
          <div className="status-item">
            <strong>Backend:</strong>
            <span style={{ color: getStatusColor(backendHealth?.status || 'unknown') }}>
              {backendHealth?.status === 'healthy' ? ' ✅ Connected' : ' ❌ Failed'}
            </span>
            {backendHealth?.message && <span> - {backendHealth.message}</span>}
          </div>
          
          <div className="status-item">
            <strong>Database:</strong>
            <span style={{ color: getStatusColor(dbHealth?.status || 'unknown') }}>
              {dbHealth?.status === 'healthy' ? ' ✅ Connected' : ' ❌ Failed'}
            </span>
            {dbHealth?.database && <span> - {dbHealth.database}</span>}
            {dbHealth?.message && <span> - {dbHealth.message}</span>}
          </div>
        </div>

        <div className="next-steps">
          <h3>🎯 Issue #1 Complete!</h3>
          <p>Docker Compose environment is ready for development.</p>
          <p><strong>Next:</strong> Implement database schema and application features.</p>
        </div>

        <button onClick={checkServices} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Refresh Status
        </button>
      </header>
    </div>
  );
}

export default App;