import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

const StorageTest = () => {
  const { testId } = useParams();
  const [formData, setFormData] = useState({
    maxTemperature: "",
    minTemperature: "",
    equipmentCode: "",
    description: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/test/storage", formData);
      const storageId = response.data;
      alert("Prueba de almacenamiento creada correctamente");

      // Actualizar el test general con el storageId
      const generalTestData = JSON.parse(localStorage.getItem('inspectionData')) || {};
      generalTestData.storageId = storageId;
      localStorage.setItem('inspectionData', JSON.stringify(generalTestData));

      navigate(`/reportes/tests`);
    } catch (error) {
      alert("Error al crear la prueba de almacenamiento");
    }
  };

  return (
    <div className="crear-usuario-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>

      <div className="crear-usuario-card">
        <h2 className="title">Prueba de Almacenamiento</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="form-group">
            <span className="label-text">Temperatura Máxima</span>
            <input type="number" name="maxTemperature" placeholder="Ingrese la temperatura máxima" value={formData.maxTemperature} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Temperatura Mínima</span>
            <input type="number" name="minTemperature" placeholder="Ingrese la temperatura mínima" value={formData.minTemperature} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Código del Equipo</span>
            <input type="text" name="equipmentCode" placeholder="Ingrese el código del equipo" value={formData.equipmentCode} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Descripción</span>
            <textarea name="description" placeholder="Ingrese la descripción" value={formData.description} onChange={handleChange} className="input-field" />
          </label>

          <button type="submit" className="primary-btn">Crear Prueba de Almacenamiento</button>
        </form>
      </div>
    </div>
  );
};

export default StorageTest;