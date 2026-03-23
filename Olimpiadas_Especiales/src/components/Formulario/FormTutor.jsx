import React from 'react'

function FormTutor({ onVolver }) {
  return (
    <div className="form-tutor-container">
      <h2 className="form-title">Inscripción de Tutor</h2>
      {/* TODO: Implementar campos del formulario de tutor */}
      <div className="action-buttons">
        <button className="btn-volver" onClick={onVolver}>Volver</button>
      </div>
    </div>
  )
}

export default FormTutor
