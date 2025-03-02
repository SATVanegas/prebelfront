import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import './TestCreation.css';

const toCamelCase = (str) => {
    return str.toLowerCase().replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  };

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
  const location = useLocation();

  useEffect(() => {
    const storedData = localStorage.getItem('inspectionData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setTestData(parsedData);
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...parsedData
      }));
    }
  }, []);

  useEffect(() => {
    if (location.state?.conditionId && location.state?.type) {
      const { conditionId, type } = location.state;
      const camelCaseType = toCamelCase(type);

      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${camelCaseType}Id`]: conditionId, // ✅ Guardar el ID en el formulario
      }));

      setTestData((prevTestData) => {
        const updatedTestData = {
          ...prevTestData,
          [`${camelCaseType}Id`]: conditionId
        };
        localStorage.setItem('inspectionData', JSON.stringify(updatedTestData));
        return updatedTestData;
      });
    }
  }, [location.state]);

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
      const response = await axios.post("http://localhost:8080/api/test", dataToSubmit);
      const testId = response.data; // Obtener el ID del test devuelto por la respuesta
      alert("Test creado correctamente");
  
      // Crear la inspección con los datos guardados y el ID del test
      const inspectionData = {
        ...testData,
        testId,
        realDate: new Date().toISOString().split('T')[0],
        expectedDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        responseTime: Math.ceil((new Date() - new Date(testData.realDate)) / (1000 * 60 * 60 * 24))
      };
  
      try {
        await axios.post("http://localhost:8080/inspections", inspectionData);
        alert("Inspección creada exitosamente");
        navigate(`/reportes/anadir`, { state: { ...testData, testId } });
      } catch (error) {
        alert("Error al crear la inspección");
      }
    } catch (error) {
      alert("Error al crear el test");
    }
  };

  const handleConditionTest = (type) => {
    navigate(`/reportes/tests/condition`, { state: { type } });
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
            <button type="button" className={`test-btn ${formData.colorId ? 'filled' : ''}`} onClick={() => handleConditionTest('COLOR')}>Prueba de color</button>
          </label>

          <label className="form-group">
            <button type="button" className={`test-btn ${formData.odorId ? 'filled' : ''}`} onClick={() => handleConditionTest('ODOR')}>Prueba de olor</button>
          </label>

          <label className="form-group">
            <button type="button" className={`test-btn ${formData.appearanceId ? 'filled' : ''}`} onClick={() => handleConditionTest('APPEARANCE')}>Prueba de apariencia</button>
          </label>

          <label className="form-group">
            <button type="button" className={`test-btn ${formData.phId ? 'filled' : ''}`} onClick={() => handleConditionTest('PH')}>Prueba de pH</button>
          </label>

          <label className="form-group">
            <button type="button" className={`test-btn ${formData.viscosityId ? 'filled' : ''}`} onClick={() => handleConditionTest('VISCOSITY')}>Prueba de viscosidad</button>
          </label>

          <label className="form-group">
            <button type="button" className={`test-btn ${formData.specificGravityId ? 'filled' : ''}`} onClick={() => handleConditionTest('SPECIFIC_GRAVITY')}>Prueba de gravedad específica</button>
          </label>

          <label className="form-group">
            <button type="button" className={`test-btn ${formData.totalBacteriaCountId ? 'filled' : ''}`} onClick={() => handleConditionTest('TOTAL_BACTERIA_COUNT')}>Prueba de recuento total de bacterias</button>
          </label>

          <label className="form-group">
            <button type="button" className={`test-btn ${formData.fungiYeastCountId ? 'filled' : ''}`} onClick={() => handleConditionTest('FUNGI_YEAST_COUNT')}>Prueba de recuento de hongos y levaduras</button>
          </label>

          <label className="form-group">
            <button type="button" className={`test-btn ${formData.pathogensId ? 'filled' : ''}`} onClick={() => handleConditionTest('PATHOGENS')}>Prueba de patógenos</button>
          </label>

          <label className="form-group">
          <button type="button" className={`test-btn ${testData.temperatureId ? 'filled' : ''}`} onClick={() => navigate(`/reportes/tests/temperature`)}>Temperatura</button>
          </label>

          <label className="form-group">
          <button type="button" className={`test-btn ${testData.storageId ? 'filled' : ''}`} onClick={() => navigate(`/reportes/tests/storage`)}>Almacenamiento</button>
          </label>

          <label className="form-group">
            <span className="label-text">Observaciones</span>
            <textarea name="observations" placeholder="Ingrese las observaciones" value={formData.observations} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Conclusión</span>
            <textarea name="conclusion" placeholder="Ingrese la conclusión" value={formData.conclusion} onChange={handleChange} className="input-field" />
          </label>
          <button type="submit" className="primary-btn">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default TestCreation;