import React, { useEffect } from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, data }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevenir propagación
        e.stopPropagation(); // Asegurar que no se propague
        onConfirm();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirma los datos ingresados</h2>
        <p className="modal-warning">
          ⚠️ Revisa la información ingresada antes de continuar. No podrás modificarla más adelante. ⚠️
        </p>
        <div className="modal-data">
          <div className="data-row">
            <strong>Producto:</strong> 
            <span>{data.productName}</span>
          </div>
          <div className="data-row">
            <strong>Estufa de Aerosol:</strong> 
            <span>{data.aerosolStove}</span>
          </div>
          <div className="data-row">
            <strong>Entrada/Salida:</strong> 
            <span>{data.inOut}</span>
          </div>
          <div className="data-row">
            <strong>Estufa:</strong> 
            <span>{data.stove}</span>
          </div>
          <div className="data-row">
            <strong>Estufa HR:</strong> 
            <span>{data.hrStove}</span>
          </div>
          <div className="data-row">
            <strong>Ambiente:</strong> 
            <span>{data.environment}</span>
          </div>
          <div className="data-row">
            <strong>Nevera:</strong> 
            <span>{data.fridge}</span>
          </div>
          <div className="data-row">
            <strong>Fotólisis:</strong> 
            <span>{data.photolysis}</span>
          </div>
        </div>
        <div className="modal-buttons">
          <button className="modal-btn cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="modal-btn confirm" onClick={onConfirm} autoFocus>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;