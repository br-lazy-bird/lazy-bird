import React, { useState, useEffect } from "react";
import "./App.css";

interface ApiResponse {
  message?: string;
  status?: string;
  service?: string;
}

function App() {
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");
  const [dbStatus, setDbStatus] = useState<string>("Checking...");

  useEffect(() => {
    fetch("/health")
      .then((response) => response.json())
      .then((data: ApiResponse) => {
        setBackendStatus(data.status || "Unknown");
      })
      .catch(() => {
        setBackendStatus("Error");
      });

    fetch("/db-test")
      .then((response) => response.json())
      .then((data: ApiResponse) => {
        setDbStatus(data.status || "Unknown");
      })
      .catch(() => {
        setDbStatus("Error");
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Employee Directory</h1>
        <p>Lazy Bird Project - Database Optimization Learning System</p>

        <div className="status-section">
          <h2>System Status</h2>
          <div className="status-item">
            <span>Backend: </span>
            <span className={`status ${backendStatus.toLowerCase()}`}>
              {backendStatus}
            </span>
          </div>
          <div className="status-item">
            <span>Database: </span>
            <span className={`status ${dbStatus.toLowerCase()}`}>
              {dbStatus}
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
