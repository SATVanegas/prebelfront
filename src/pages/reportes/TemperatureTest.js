import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

const TemperatureTest = () => {
  const { testId } = useParams();
  const [formData, setFormData] = useState({
    unit: "",
    time: "",
    equipment: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/test/temperature", formData);
      const temperatureId = response.data;
      alert("Prueba de temperatura creada correctamente");

      // Actualizar el test general con el temperatureId
      const generalTestData = JSON.parse(localStorage.getItem('inspectionData')) || {};
      generalTestData.temperatureId = temperatureId;
      localStorage.setItem('inspectionData', JSON.stringify(generalTestData));

      navigate(`/reportes/tests`);
    } catch (error) {
      alert("Error al crear la prueba de temperatura");
    }
  };

  return (
    <div className="crear-usuario-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>

      <div className="crear-usuario-card">
        <h2 className="title">Prueba de Temperatura</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="form-group">
            <span className="label-text">Unidad</span>
            <input type="text" name="unit" placeholder="Ingrese la unidad" value={formData.unit} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Tiempo (semanas)</span>
            <input type="number" name="time" placeholder="Ingrese el tiempo en semanas" value={formData.time} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Equipo</span>
            <input type="text" name="equipment" placeholder="Ingrese el equipo" value={formData.equipment} onChange={handleChange} className="input-field" />
          </label>

          <button type="submit" className="primary-btn">Crear Prueba de Temperatura</button>
        </form>
      </div>
    </div>
  );
};

export default TemperatureTest;