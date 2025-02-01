import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './pages/login/AuthContext';
import Login from './pages/login/Logn';
import Home from './pages/Home';
import Roles from './pages/roles/Roles';
import CrearUsuario from './pages/roles/CrearUsuario';
import CrearRol from './pages/roles/CrearRol';
import ModificarPermisos from './pages/roles/ModificarPermisos';
import VisualizarPermisos from './pages/roles/VisualizarPermisos';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav>
      {!user ? (
        <Link to="" className="App-link"></Link>
      ) : (
        <>
          <Link to="/" className="home-btn">Home</Link>
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
            </Routes>
          </header>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;