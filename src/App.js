import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Login from  './pages/login/Logn'; // Importa el componente de Login

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/* Enlaces de navegación */}
          <nav>
            <Link to="/" className="App-link">Home</Link> |{' '}
            <Link to="/login" className="App-link">Login</Link>
          </nav>
          {/* Configuración de rutas */}
          <Routes>
            <Route path="/" element={
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;