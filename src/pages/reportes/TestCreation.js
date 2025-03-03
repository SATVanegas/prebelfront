import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import './TestCreation.css';

const toCamelCase = (str) => {
    return str.toLowerCase().replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const TestCreation = () => {
  const [formData, setFormData] = useState({
    unit: '',
    time: '',
    equipment: '',
    method: '',
    specification: '',
    initialResultsDevelopmentLaboratory: '',
    initialResultsStabilityLaboratory: '',
    maxTemperature: '',
    minTemperature: '',
    equipmentCode: '',
    description: '',
    // IDs para los tests
    colorId: null,
    odorId: null,
    appearanceId: null,
    phId: null,
    viscosityId: null,
    specificGravityId: null,
    totalBacteriaCountId: null,
    fungiYeastCountId: null,
    pathogensId: null,
    // Campos adicionales
    observations: '',
    conclusion: ''
  });
  const [testData, setTestData] = useState(null);
  const [testsData, setTestsData] = useState({
    temperature: null,
    storage: null,
    conditions: {}
  });
  const [inspectionData, setInspectionData] = useState(null);

  
  const [errors, setErrors] = useState({});
  const [selectedTest, setSelectedTest] = useState(null); // Estado para el test seleccionado
  const navigate = useNavigate();
  const location = useLocation();
  const [showConclusionModal, setShowConclusionModal] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [testToConfirm, setTestToConfirm] = useState(null);


  useEffect(() => {
    const storedData = localStorage.getItem('inspectionData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log('Datos recibidos de AnadirReporte:', parsedData);
      setInspectionData(parsedData);
      setTestData(parsedData);
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...parsedData
      }));
    } else {
      console.log('No se encontraron datos en localStorage');
    }
  }, []);

  const areAllTestsCompleted = () => {
    const allCompleted = (
      formData.colorId &&
      formData.odorId &&
      formData.appearanceId &&
      formData.phId &&
      formData.viscosityId &&
      formData.specificGravityId &&
      formData.totalBacteriaCountId &&
      formData.fungiYeastCountId &&
      formData.pathogensId &&
      formData.temperatureId && // Cambiado de testData a formData
      formData.storageId       // Cambiado de testData a formData
    );
  
    if (allCompleted && !showConclusionModal) {
      setShowConclusionModal(true);
    }
  
    return allCompleted;
  };

  const getRemainingTests = () => {
    const tests = {
      'Color': formData.colorId,
      'Olor': formData.odorId,
      'Apariencia': formData.appearanceId,
      'pH': formData.phId,
      'Viscosidad': formData.viscosityId,
      'Gravedad específica': formData.specificGravityId,
      'Recuento total de bacterias': formData.totalBacteriaCountId,
      'Recuento de hongos y levaduras': formData.fungiYeastCountId,
      'Patógenos': formData.pathogensId,
      'Temperatura': formData.temperatureId, // Cambiado de testData a formData
      'Almacenamiento': formData.storageId  // Cambiado de testData a formData
    };
  
    const remainingTests = Object.entries(tests)
      .filter(([_, value]) => !value)
      .map(([name]) => name);
  
    return {
      completed: Object.values(tests).filter(Boolean).length,
      total: Object.keys(tests).length,
      remaining: remainingTests
    };
  };

  const getFieldLabel = (key) => {
    const fieldLabels = {
      unit: "Unidad",
      time: "Tiempo (semanas)",
      equipment: "Equipo",
      maxTemperature: "Temperatura Máxima",
      minTemperature: "Temperatura Mínima",
      equipmentCode: "Código del Equipo",
      description: "Descripción",
      method: "Método",
      specification: "Especificación",
      initialResultsDevelopmentLaboratory: "Resultados Iniciales (Laboratorio de Desarrollo)",
      initialResultsStabilityLaboratory: "Resultados Iniciales (Laboratorio de Estabilidad)",
      stabilitiesMatrixId: "ID de Matriz de Estabilidad"
    };
    return fieldLabels[key] || key;
  };

  const handleKeyDown = (e) => {
    // Prevenir el comportamiento por defecto de las flechas arriba/abajo
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  
    // Si es flecha abajo o enter, mover al siguiente input
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"], textarea'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
  
      if (nextInput) {
        nextInput.focus();
      } else if (e.key === 'Enter') {
        // Si es el último input y presiona enter, enviar el formulario
        const form = e.target.closest('form');
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]');
          if (submitButton) submitButton.click();
        }
      }
    }
  
    // Si es flecha arriba, mover al input anterior
    if (e.key === 'ArrowUp') {
      const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"], textarea'));
      const currentIndex = inputs.indexOf(e.target);
      const prevInput = inputs[currentIndex - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const TestConfirmationModal = ({ isOpen, onClose, onConfirm, data, type }) => {
    if (!isOpen) return null;
  
    // Filtrar stabilitiesMatrixId del objeto data si quieres ocultarlo
    const displayData = Object.entries(data).filter(([key]) => key !== 'stabilitiesMatrixId');
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirma los datos ingresados</h2>
          <p className="modal-warning">
            ⚠️ Revisa la información ingresada antes de continuar ⚠️
          </p>
          <div className="modal-data">
            <h3>{getTitle(type)}</h3>
            {displayData.map(([key, value]) => (
              <div className="data-row" key={key}>
                <strong>{getFieldLabel(key)}:</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <div className="modal-buttons">
            <button className="modal-btn cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="modal-btn confirm" onClick={onConfirm}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (location.state?.conditionId && location.state?.type) {
      const { conditionId, type } = location.state;
      const camelCaseType = toCamelCase(type);

      setFormData((prevFormData) => {
        const updatedFormData = {
          ...prevFormData,
          [`${camelCaseType}Id`]: conditionId,
        };
        
        // Verifica si todos los tests están completos después de actualizar
        if (areAllTestsCompleted()) {
          setShowConclusionModal(true);
        }
        
        return updatedFormData;
      });

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
    try {

      // 0. Obtener el stabilitiesMatrixId correcto del producto
    const productResponse = await axios.get(`http://localhost:8080/api/products/dto/${testData.stabilitiesMatrixId}`);
    const correctMatrixId = productResponse.data.stabilitiesMatrixId;


      // 1. Crear temperatura y almacenamiento
      const temperatureResponse = await axios.post(
        "http://localhost:8080/api/test/temperature", 
        testsData.temperature
      );
      
      const storageResponse = await axios.post(
        "http://localhost:8080/api/test/storage", 
        testsData.storage
      );
  
      // 2. Crear el test principal (formato específico requerido)
      const testDTO = {
        productId: Number(testData.stabilitiesMatrixId),
        temperatureId: Number(temperatureResponse.data),
        storageId: Number(storageResponse.data),
        observations: formData.observations || "",
        conclusion: formData.conclusion || ""
      };
  
      console.log('Test DTO a enviar:', testDTO); // Para debugging
  
      const testResponse = await axios.post(
        "http://localhost:8080/api/test", 
        testDTO
      );
  
      // 3. Crear la inspección (formato específico requerido)
      const inspectionDTO = {
        expectedDate: testData.expectedDate,
        realDate: testData.realDate,
        responseTime: Number(testData.responseTime),
        aerosolStove: Number(testData.aerosolStove),
        inOut: Number(testData.inOut),
        stove: Number(testData.stove),
        hrStove: Number(testData.hrStove),
        environment: Number(testData.environment),
        fridge: Number(testData.fridge),
        photolysis: Number(testData.photolysis),
        stabilitiesMatrixId: Number(correctMatrixId),
        testId: Number(testResponse.data)
      };
  
      console.log('Inspection DTO a enviar:', inspectionDTO); // Para debugging
  
      await axios.post("http://localhost:8080/inspections", inspectionDTO);
  
      // 4. Crear las condiciones
      for (const [type, data] of Object.entries(testsData.conditions)) {
        const conditionData = {
          ...data,
          type,
          testId: Number(testResponse.data)
        };
        await axios.post("http://localhost:8080/api/test/conditions", conditionData);
      }
  
      alert("Test e inspección creados exitosamente");
      navigate('/reportes/anadir');
    } catch (error) {
      console.error('Error completo:', error);
      alert("Error al crear los tests: " + error.message);
    }
  };

  const handleConditionTest = (type) => {
    setSelectedTest(type); // Actualiza el test seleccionado
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

  const handleConfirmTest = async () => {
    try {
      if (!testToConfirm?.data || !testToConfirm?.type) {
        throw new Error('Datos de test inválidos');
      }
    
      const { data, type } = testToConfirm;
      
      // Solo almacenar los datos en el estado
      if (type === 'TEMPERATURE' || type === 'STORAGE') {
        setTestsData(prev => ({
          ...prev,
          [type.toLowerCase()]: data
        }));
        
        // Actualizar el estado visual
        setFormData(prev => ({
          ...prev,
          [`${toCamelCase(type)}Id`]: 'pending'
        }));
      } else {
        setTestsData(prev => ({
          ...prev,
          conditions: {
            ...prev.conditions,
            [type]: data
          }
        }));
        
        // Actualizar el estado visual
        setFormData(prev => ({
          ...prev,
          [`${toCamelCase(type)}Id`]: 'pending'
        }));
      }
  
      // Si todos los tests están completos, mostrar modal de conclusión
      if (areAllTestsCompleted()) {
        setShowConclusionModal(true);
      }
  
      setSelectedTest(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      alert(`Error al procesar ${getTitle(testToConfirm?.type || 'test')}: ${errorMessage}`);
      console.error(error);
    } finally {
      setIsConfirmationModalOpen(false);
      setTestToConfirm(null);
    }
  };

  const renderSelectedTest = () => {
    const validateSpecificForm = (type, data) => {
      const newErrors = {};
      
      switch(type) {
        case 'TEMPERATURE':
          if (!data.unit) newErrors.unit = "⚠️ La unidad es obligatoria";
          if (!data.time) newErrors.time = "⚠️ El tiempo es obligatorio";
          if (!data.equipment) newErrors.equipment = "⚠️ El equipo es obligatorio";
          break;
        
        case 'STORAGE':
          if (!data.maxTemperature) newErrors.maxTemperature = "⚠️ La temperatura máxima es obligatoria";
          if (!data.minTemperature) newErrors.minTemperature = "⚠️ La temperatura mínima es obligatoria";
          if (Number(data.maxTemperature) <= Number(data.minTemperature)) {
            newErrors.maxTemperature = "⚠️ La temperatura máxima debe ser mayor que la mínima";
          }
          if (!data.equipmentCode) newErrors.equipmentCode = "⚠️ El código del equipo es obligatorio";
          break;
        
        default:
          if (!data.unit) newErrors.unit = "⚠️ La unidad es obligatoria";
          if (!data.time) newErrors.time = "⚠️ El tiempo es obligatorio";
          if (!data.equipment) newErrors.equipment = "⚠️ El equipo es obligatorio";
          if (!data.method) newErrors.method = "⚠️ El método es obligatorio";
      }
    
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    const handleSpecificSubmit = async (e, type) => {
      e.preventDefault();
      let data = {};
    
      switch (type) {
        case 'TEMPERATURE':
          data = {
            unit: formData.unit,
            time: formData.time,
            equipment: formData.equipment,
            stabilitiesMatrixId: testData.stabilitiesMatrixId
          };
          break;
        
        case 'STORAGE':
          data = {
            maxTemperature: formData.maxTemperature,
            minTemperature: formData.minTemperature,
            equipmentCode: formData.equipmentCode,
            description: formData.description,
            stabilitiesMatrixId: testData.stabilitiesMatrixId
          };
          break;
        
        default:
          data = {
            unit: formData.unit,
            time: formData.time,
            equipment: formData.equipment,
            method: formData.method,
            specification: formData.specification,
            initialResultsDevelopmentLaboratory: formData.initialResultsDevelopmentLaboratory,
            initialResultsStabilityLaboratory: formData.initialResultsStabilityLaboratory,
            stabilitiesMatrixId: testData.stabilitiesMatrixId
          };
          break;
      }
  
      const isValid = validateSpecificForm(type, data);
  if (!isValid) {
    // Si hay errores, retornar temprano sin mostrar el modal de confirmación
    return;
  }
      setTestToConfirm({ data, type });
      setIsConfirmationModalOpen(true);
    
      setTestsData(prev => {
        const updated = { ...prev };
        if (type === 'TEMPERATURE') {
          updated.temperature = data;
        } else if (type === 'STORAGE') {
          updated.storage = data;
        } else {
          updated.conditions[type] = data;
        }
        return updated;
      });
  
      // Actualizamos el estado visual
      setFormData(prev => ({
        ...prev,
        [`${toCamelCase(type)}Id`]: 'pending' // Marcador visual de que está completo pero pendiente de guardar
      }));
  
      setSelectedTest(null);
  
      // Si todos los tests están completos, mostramos el modal de conclusión
      if (areAllTestsCompleted()) {
        setShowConclusionModal(true);
      }
    };
  
    switch (selectedTest) {
      case 'TEMPERATURE':
  return (
    <div className="test-card">
      <h2 className="title">Prueba de Temperatura</h2>
      <form onSubmit={(e) => handleSpecificSubmit(e, 'TEMPERATURE')} className="form">
        <label className="form-group">
          <span className="label-text">Unidad</span>
          <input type="text" name="unit" placeholder="Ingrese la unidad" value={formData.unit} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
          {errors.unit && <span className="error-text">{errors.unit}</span>}
        </label>
        <label className="form-group">
          <span className="label-text">Tiempo (semanas)</span>
          <input type="number" name="time" placeholder="Ingrese el tiempo en semanas" value={formData.time} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
          {errors.time && <span className="error-text">{errors.time}</span>}
        </label>
        <label className="form-group">
          <span className="label-text">Equipo</span>
          <input type="text" name="equipment" placeholder="Ingrese el equipo" value={formData.equipment} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
          {errors.equipment && <span className="error-text">{errors.equipment}</span>}
        </label>
        <button type="submit" className="primary-btn">Crear Prueba de Temperatura</button>
      </form>
    </div>
  );
  case 'STORAGE':
    return (
      <div className="test-card">
        <h2 className="title">Prueba de Almacenamiento</h2>
        <form onSubmit={(e) => handleSpecificSubmit(e, 'STORAGE')} className="form">
          <label className="form-group">
            <span className="label-text">Temperatura Máxima</span>
            <input 
              type="number" 
              name="maxTemperature" 
              placeholder="Ingrese la temperatura máxima" 
              value={formData.maxTemperature} 
              onChange={handleChange} 
              className="input-field" 
            />
            {errors.maxTemperature && <span className="error-text">{errors.maxTemperature}</span>}
          </label>
          <label className="form-group">
            <span className="label-text">Temperatura Mínima</span>
            <input type="number" name="minTemperature" placeholder="Ingrese la temperatura mínima" value={formData.minTemperature} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
            {errors.minTemperature && <span className="error-text">{errors.minTemperature}</span>}
          </label>
          <label className="form-group">
            <span className="label-text">Código del Equipo</span>
            <input type="text" name="equipmentCode" placeholder="Ingrese el código del equipo" value={formData.equipmentCode} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
            {errors.equipmentCode && <span className="error-text">{errors.equipmentCode}</span>}
          </label>
          <label className="form-group">
            <span className="label-text">Descripción</span>
            <textarea name="description" placeholder="Ingrese la descripción" value={formData.description} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
          </label>
          <button type="submit" className="primary-btn">Crear Prueba de Almacenamiento</button>
        </form>
      </div>
    );
      case 'CONDITION':
      case 'COLOR':
      case 'ODOR':
      case 'APPEARANCE':
      case 'PH':
      case 'VISCOSITY':
      case 'SPECIFIC_GRAVITY':
      case 'TOTAL_BACTERIA_COUNT':
      case 'FUNGI_YEAST_COUNT':
      case 'PATHOGENS':
        return (
          <div className="test-card">
            <h2 className="title">{getTitle(selectedTest)}</h2>
            <form onSubmit={(e) => handleSpecificSubmit(e, selectedTest)} className="form">
            <div className="form-row">
  <label className="form-group">
    <span className="label-text">Unidad</span>
    <input 
      type="text" 
      name="unit" 
      placeholder="Ingrese la unidad" 
      value={formData.unit} 
      onChange={handleChange}
      onKeyDown={handleKeyDown} 
      className="input-field" 
    />
    {errors.unit && <span className="error-text">{errors.unit}</span>}
  </label>
  <label className="form-group">
    <span className="label-text">Tiempo (semanas)</span>
    <input 
      type="number" 
      name="time" 
      placeholder="Ingrese el tiempo" 
      value={formData.time} 
      onChange={handleChange}
      onKeyDown={handleKeyDown} 
      className="input-field" 
    />
    {errors.time && <span className="error-text">{errors.time}</span>}
  </label>
</div>
<div className="form-row">
  <label className="form-group">
    <span className="label-text">Equipo</span>
    <input type="text" name="equipment" placeholder="Ingrese el equipo" value={formData.equipment} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field"/>
    {errors.equipment && <span className="error-text">{errors.equipment}</span>}
  </label>
  <label className="form-group">
    <span className="label-text">Método</span>
    <input type="text" name="method" placeholder="Ingrese el método" value={formData.method} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
    {errors.method && <span className="error-text">{errors.method}</span>}
  </label>
</div>
              <label className="form-group">
                <span className="label-text">Especificación</span>
                <textarea name="specification" placeholder="Ingrese la especificación" value={formData.specification} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
              </label>
              <label className="form-group">
                <span className="label-text">Resultados Iniciales (Laboratorio de Desarrollo)</span>
                <textarea name="initialResultsDevelopmentLaboratory" placeholder="Ingrese los resultados iniciales" value={formData.initialResultsDevelopmentLaboratory} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
              </label>
              <label className="form-group">
                <span className="label-text">Resultados Iniciales (Laboratorio de Estabilidad)</span>
                <textarea name="initialResultsStabilityLaboratory" placeholder="Ingrese los resultados iniciales" value={formData.initialResultsStabilityLaboratory} onChange={handleChange} onKeyDown={handleKeyDown} className="input-field" />
              </label>
              <button type="submit" className="primary-btn">Guardar prueba</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  if (!testData) {
    return <div>Loading...</div>;
  }

  const productName = localStorage.getItem('selectedProductName') || 'Producto';


  const ConclusionModal = () => {
    if (!showConclusionModal) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Finalizar Test</h2>
          <form onSubmit={handleSubmit}>
            <label className="form-group">
              <span className="label-text">Observaciones</span>
              <textarea
                name="observations"
                placeholder="Ingrese las observaciones"
                value={formData.observations}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                  className="input-field"
              />
            </label>
            <label className="form-group">
              <span className="label-text">Conclusión</span>
              <textarea
                name="conclusion"
                placeholder="Ingrese la conclusión"
                value={formData.conclusion}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="input-field"
              />
            </label>
            <div className="modal-buttons">
              <button type="submit" className="primary-btn">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const TestProgress = () => {
    const { completed, total } = getRemainingTests();
    
    return (
        <p>
          {completed === total ? 
            '✅ Todas las pruebas han sido completadas' : 
            `📋 Pruebas completadas: ${completed}/${total}`
          }
        </p>
    );
  };

  return (
    <div className="test-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>
      <div className="test-content">
        <div className="test-list">
          <div className="test-card">
            <h2 className="title">Pruebas para: {productName}</h2>
            <TestProgress />
            <form onSubmit={handleSubmit} className="form">
              <div className="test-buttons-container">
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.colorId ? 'filled' : ''}`} onClick={() => handleConditionTest('COLOR')}>Color</button>
                </label>
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.odorId ? 'filled' : ''}`} onClick={() => handleConditionTest('ODOR')}>Olor</button>
                </label>
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.phId ? 'filled' : ''}`} onClick={() => handleConditionTest('PH')}>pH</button>
                </label>
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.pathogensId ? 'filled' : ''}`} onClick={() => handleConditionTest('PATHOGENS')}>Patógenos</button>
                </label>
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.viscosityId ? 'filled' : ''}`} onClick={() => handleConditionTest('VISCOSITY')}>Viscosidad</button>
                </label>
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.appearanceId ? 'filled' : ''}`} onClick={() => handleConditionTest('APPEARANCE')}>Apariencia</button>
                </label>
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.temperatureId ? 'filled' : ''}`} onClick={() => handleConditionTest('TEMPERATURE')}>Temperatura</button>
                </label>
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.storageId ? 'filled' : ''}`} onClick={() => handleConditionTest('STORAGE')}>Almacenamiento</button>
                </label>
              </div>
              <div className="test-buttons-container">
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.specificGravityId ? 'filled' : ''}`} onClick={() => handleConditionTest('SPECIFIC_GRAVITY')}>Gravedad específica</button>
                </label>
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.totalBacteriaCountId ? 'filled' : ''}`} onClick={() => handleConditionTest('TOTAL_BACTERIA_COUNT')}>Recuento total de bacterias</button>
                </label>
                <label className="form-group">
                  <button type="button" className={`test-btn ${formData.fungiYeastCountId ? 'filled' : ''}`} onClick={() => handleConditionTest('FUNGI_YEAST_COUNT')}>Recuento de hongos y levaduras</button>
                </label>
              </div>
            </form>
          </div>
        </div>
        <div className="test-details">
          {renderSelectedTest()}
        </div>
        <TestConfirmationModal 
      isOpen={isConfirmationModalOpen}
      onClose={() => setIsConfirmationModalOpen(false)}
      onConfirm={handleConfirmTest}
      data={testToConfirm?.data || {}}
      type={testToConfirm?.type || ''}
    />
        <ConclusionModal />
      </div>
    </div>
  );
};

export default TestCreation;