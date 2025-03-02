import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

const ConditionTest = () => {
  const { testId } = useParams();
  const [formData, setFormData] = useState({
    type: "",
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
      const response = await axios.post(`/api/tests/${testId}/condition`, formData);
      alert("Condition Test creado correctamente");
      navigate(`/tests/${testId}`);
    } catch (error) {
      alert("Error al crear el Condition Test");
    }
  };

  return (
    <div className="condition-test-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>

      <div className="condition-test-card">
        <h2 className="title">Crear Condition Test</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="form-group">
            <span className="label-text">Tipo</span>
            <select name="type" value={formData.type} onChange={handleChange} className="input-field">
              <option value="">Seleccione el tipo</option>
              <option value="APPEARANCE">Appearance</option>
              <option value="COLOR">Color</option>
              <option value="FUNGAL_YEAST_COUNT">Fungal Yeast Count</option>
              <option value="ODOR">Odor</option>
              <option value="PATHOGENS">Pathogens</option>
              <option value="PH">pH Level</option>
              <option value="SPECIFIC_GRAVITY">Specific Gravity</option>
              <option value="TOTAL_BACTERIA_COUNT">Total Bacteria Count</option>
              <option value="VISCOSITY">Viscosity</option>
            </select>
          </label>

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

          <label className="form-group">
            <span className="label-text">Método</span>
            <input type="text" name="method" placeholder="Ingrese el método" value={formData.method} onChange={handleChange} className="input-field" />
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