import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
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
import MenuPlanificador from './pages/programacion/menu';
import ConsultarReporte from './pages/reportes/ConsultarReporte';
import AnadirReporte from './pages/reportes/AnadirReporte';
import ConsultarProgramacion from './pages/programacion/ConsultarProgramacion';
import AnadirProgramacion from './pages/programacion/AnadirProgramacion';
import EditarProgramacion from './pages/programacion/EditarProgramacion';
import EliminarProgramacion from './pages/programacion/EliminarProgramacion';
import ConsultarMatriz from './pages/matriz/ConsultarMatriz';
import AnadirMatriz from './pages/matriz/AnadirMatriz';
import EditarMatriz from './pages/matriz/EditarMatriz';
import EliminarMatriz from './pages/matriz/EliminarMatriz';
import ComingSoon from './pages/Coming-soon';
import TestCreation from './pages/reportes/TestCreation';
import TemperatureTest from './pages/reportes/TemperatureTest';
import StorageTest from './pages/reportes/StorageTest';
import ConditionTest from './pages/reportes/ConditionTest';
import ImprimirReportes from './pages/reportes/ImprimirReportes';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
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
              <Route path="/programacion" element={<ProtectedRoute element={<MenuPlanificador />} />} />
              <Route path="/reportes/consultar" element={<ConsultarReporte />} />
              <Route path="/reportes/anadir" element={<AnadirReporte />} />
              <Route path="/programacion/consultar" element={<ConsultarProgramacion />} />
              <Route path="/programacion/anadir" element={<AnadirProgramacion />} />
              <Route path="/programacion/editar" element={<EditarProgramacion />} />
              <Route path="/programacion/eliminar" element={<EliminarProgramacion />} />
              <Route path="/matriz/consultar" element={<ConsultarMatriz />} />
              <Route path="/matriz/anadir" element={<AnadirMatriz />} />
              <Route path="/matriz/editar" element={<EditarMatriz />} />
              <Route path="/matriz/eliminar" element={<EliminarMatriz />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/reportes/tests" element={<TestCreation />} />
              <Route path="/reportes/tests/temperature" element={<TemperatureTest />} />
              <Route path="/reportes/tests/storage" element={<StorageTest />} />
              <Route path="/reportes/tests/condition" element={<ConditionTest />} />
              <Route path="/reportes/consultar" element={<ConsultarReporte />} />
              <Route path="/reportes/imprimir" element={<ImprimirReportes />} />
            </Routes>
          </header>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;