import React from 'react';
import PerformanceTest from './components/PerformanceTest/PerformanceTest.tsx';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="container">
      <div className="app-wrapper">
        <h1 className="page-title">Lazy Bird</h1>
        <PerformanceTest />
      </div>
    </div>
  );
};

export default App;