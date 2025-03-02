import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

const ConditionTest = () => {
  const { state } = useLocation();
  const { type } = state;
  const [formData, setFormData] = useState({
    unit: "",
    time: "",
    equipment: "",
    method: "",
    specification: "",
    initialResultsDevelopmentLaboratory: "",
    initialResultsStabilityLaboratory: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/test/conditions`, { ...formData, type });
      const conditionId = response.data;
      alert("Condition Test creado correctamente");
      navigate(`/reportes/tests`, { state: { conditionId, type } }); // ✅ Enviar el ID y el tipo a TestCreation
    } catch (error) {
      alert("Error al crear el Condition Test");
    }
  };

  const getTitle = (type) => {
    switch (type) {
      case 'COLOR':
        return 'Prueba de color';
      case 'ODOR':
        return 'Prueba de olor';
      case 'APPEARANCE':
        return 'Prueba de apariencia';
      case 'PH':
        return 'Prueba de pH';
      case 'VISCOSITY':
        return 'Prueba de viscosidad';
      case 'SPECIFIC_GRAVITY':
        return 'Prueba de gravedad específica';
      case 'TOTAL_BACTERIA_COUNT':
        return 'Prueba de recuento total de bacterias';
      case 'FUNGI_YEAST_COUNT':
        return 'Prueba de recuento de hongos y levaduras';
      case 'PATHOGENS':
        return 'Prueba de patógenos';
      default:
        return 'Prueba';
    }
  };

  return (
    <div className="test-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>

      <div className="test-card">
        <h2 className="title">{getTitle(type)}</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="form-group">
            <span className="label-text">Unidad</span>
            <input type="text" name="unit" placeholder="Ingrese la unidad" value={formData.unit} onChange={handleChange} className="input-field" required />
          </label>

          <label className="form-group">
            <span className="label-text">Tiempo (semanas)</span>
            <input type="number" name="time" placeholder="Ingrese el tiempo en semanas" value={formData.time} onChange={handleChange} className="input-field" required />
          </label>

          <label className="form-group">
            <span className="label-text">Equipo</span>
            <input type="number" name="equipment" placeholder="Ingrese el equipo" value={formData.equipment} onChange={handleChange} className="input-field" required />
          </label>

          <label className="form-group">
            <span className="label-text">Método</span>
            <input type="text" name="method" placeholder="Ingrese el método" value={formData.method} onChange={handleChange} className="input-field" required />
          </label>

          <label className="form-group">
            <span className="label-text">Especificación</span>
            <textarea name="specification" placeholder="Ingrese la especificación" value={formData.specification} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Resultados Iniciales (Laboratorio de Desarrollo)</span>
            <textarea name="initialResultsDevelopmentLaboratory" placeholder="Ingrese los resultados iniciales" value={formData.initialResultsDevelopmentLaboratory} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Resultados Iniciales (Laboratorio de Estabilidad)</span>
            <textarea name="initialResultsStabilityLaboratory" placeholder="Ingrese los resultados iniciales" value={formData.initialResultsStabilityLaboratory} onChange={handleChange} className="input-field" />
          </label>

          <button type="submit" className="primary-btn">Crear Condition Test</button>
        </form>
      </div>
    </div>
  );
};

export default ConditionTest;