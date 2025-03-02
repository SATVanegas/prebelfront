import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './TestCreation.css';

const TestCreation = () => {
  const [testData, setTestData] = useState(null);
  const [formData, setFormData] = useState({
    colorId: "",
    odorId: "",
    appearanceId: "",
    phId: "",
    viscosityId: "",
    specificGravityId: "",
    totalBacteriaCountId: "",
    fungiYeastCountId: "",
    pathogensId: "",
    observations: "",
    conclusion: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('inspectionData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setTestData(parsedData);
      setFormData({
        ...formData,
        ...parsedData
      });
    }
  }, []);

  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    localStorage.setItem('inspectionData', JSON.stringify({ ...testData, ...updatedFormData }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.colorId) newErrors.colorId = "El valor de Color es obligatorio";
    if (!formData.odorId) newErrors.odorId = "El valor de Olor es obligatorio";
    if (!formData.appearanceId) newErrors.appearanceId = "El valor de Apariencia es obligatorio";
    if (!formData.phId) newErrors.phId = "El valor de pH es obligatorio";
    if (!formData.viscosityId) newErrors.viscosityId = "El valor de Viscosidad es obligatorio";
    if (!formData.specificGravityId) newErrors.specificGravityId = "El valor de Gravedad específica es obligatorio";
    if (!formData.totalBacteriaCountId) newErrors.totalBacteriaCountId = "El valor de Recuento total de bacterias es obligatorio";
    if (!formData.fungiYeastCountId) newErrors.fungiYeastCountId = "El valor de Recuento de hongos y levaduras es obligatorio";
    if (!formData.pathogensId) newErrors.pathogensId = "El valor de Patógenos es obligatorio";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
  
    if (!testData.temperatureId || !testData.storageId) {
      alert("Debe crear las pruebas de temperatura y almacenamiento antes de crear el test principal.");
      return;
    }
  
    const dataToSubmit = {
      ...formData,
      productId: testData.stabilitiesMatrixId,
      temperatureId: testData.temperatureId,
      storageId: testData.storageId,
    };
  
    try {
      const response = await axios.post("localhost:8080/api/test", dataToSubmit);
      alert("Test creado correctamente");
      navigate(`/reportes/tests/condition`); // ✅ Ahora solo redirige si el test se crea bien
    } catch (error) {
      alert("Error al crear el test");
    }
  };

  if (!testData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="test-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>

      <div className="test-card">
        <h2 className="title">Crear Test</h2>
        <form onSubmit={handleSubmit} className="form">
          <p><strong>Producto evaluado:</strong> {testData.stabilitiesMatrixId}</p>
          
          <label className="form-group">
            <span className="label-text">Color</span>
            <input type="number" name="colorId" placeholder="Ingrese el valor" value={formData.colorId} onChange={handleChange} className="input-field" />
            {errors.colorId && <span className="error-text">{errors.colorId}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Olor</span>
            <input type="number" name="odorId" placeholder="Ingrese el valor" value={formData.odorId} onChange={handleChange} className="input-field" />
            {errors.odorId && <span className="error-text">{errors.odorId}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Apariencia</span>
            <input type="number" name="appearanceId" placeholder="Ingrese el valor" value={formData.appearanceId} onChange={handleChange} className="input-field" />
            {errors.appearanceId && <span className="error-text">{errors.appearanceId}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">pH</span>
            <input type="number" name="phId" placeholder="Ingrese el valor" value={formData.phId} onChange={handleChange} className="input-field" />
            {errors.phId && <span className="error-text">{errors.phId}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Viscosidad</span>
            <input type="number" name="viscosityId" placeholder="Ingrese el valor" value={formData.viscosityId} onChange={handleChange} className="input-field" />
            {errors.viscosityId && <span className="error-text">{errors.viscosityId}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Gravedad específica</span>
            <input type="number" name="specificGravityId" placeholder="Ingrese el valor" value={formData.specificGravityId} onChange={handleChange} className="input-field" />
            {errors.specificGravityId && <span className="error-text">{errors.specificGravityId}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Recuento total de bacterias</span>
            <input type="number" name="totalBacteriaCountId" placeholder="Ingrese el valor" value={formData.totalBacteriaCountId} onChange={handleChange} className="input-field" />
            {errors.totalBacteriaCountId && <span className="error-text">{errors.totalBacteriaCountId}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Recuento de hongos y levaduras</span>
            <input type="number" name="fungiYeastCountId" placeholder="Ingrese el valor" value={formData.fungiYeastCountId} onChange={handleChange} className="input-field" />
            {errors.fungiYeastCountId && <span className="error-text">{errors.fungiYeastCountId}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Patógenos</span>
            <input type="number" name="pathogensId" placeholder="Ingrese el valor" value={formData.pathogensId} onChange={handleChange} className="input-field" />
            {errors.pathogensId && <span className="error-text">{errors.pathogensId}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Observaciones</span>
            <textarea name="observations" placeholder="Ingrese las observaciones" value={formData.observations} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Conclusión</span>
            <textarea name="conclusion" placeholder="Ingrese la conclusión" value={formData.conclusion} onChange={handleChange} className="input-field" />
          </label>
          <div className="btn-container">
            <button type="button" className="test-btn" onClick={() => navigate(`/reportes/tests/temperature`)}>Temperatura</button>
            <button type="button" className="test-btn" onClick={() => navigate(`/reportes/tests/storage`)}>Almacenamiento</button>
          </div>
          <button type="submit" className="primary-btn">Continuar</button>
        </form>
      </div>
    </div>
  );
};

export default TestCreation;