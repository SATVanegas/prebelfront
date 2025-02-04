import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './pages/login/AuthContext';
import Login from './pages/login/Login';
import Home from './pages/Home';
import Roles from './pages/roles/Roles';
import CrearUsuario from './pages/roles/CrearUsuario';
import CrearRol from './pages/roles/CrearRol';
import ModificarPermisos from './pages/roles/ModificarPermisos';
import VisualizarPermisos from './pages/roles/VisualizarPermisos';
import Matriz from './pages/matriz/matriz';
import Reportes from './pages/reportes/reportes';
import Programacion from './pages/programacion/programacion';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const Navigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = window.location.pathname;
  const ocultarBotones = location === "/login" || location === "/";

  return (
    <nav className="navigation">
      {user && !ocultarBotones && (
        <>
          <button onClick={() => navigate(-1)} className="back-button">
            ⬅ <span>Atrás</span>
          </button>
          <Link to="/" className="home-btn">
            🏠 <span>Home</span>
          </Link>
        </>
      )}
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute element={<Home />} />} />
              <Route path="/roles" element={<ProtectedRoute element={<Roles />} />} />
              <Route path="/crear-usuario" element={<ProtectedRoute element={<CrearUsuario />} />} />
              <Route path="/crear-rol" element={<ProtectedRoute element={<CrearRol />} />} />
              <Route path="/modificar-permisos" element={<ProtectedRoute element={<ModificarPermisos />} />} />
              <Route path="/visualizar-permisos" element={<ProtectedRoute element={<VisualizarPermisos />} />} />
              <Route path="/matriz" element={<ProtectedRoute element={<Matriz />} />} />
              <Route path="/reportes" element={<ProtectedRoute element={<Reportes />} />} />
              <Route path="/programacion" element={<ProtectedRoute element={<Programacion />} />} />
            </Routes>
          </header>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;