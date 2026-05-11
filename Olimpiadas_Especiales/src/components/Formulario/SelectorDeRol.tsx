import React from 'react';
import type { RolType } from '../../types';
import "../../styles/Formulario/SelectorRoles.css";

interface RolItem {
  id: RolType;
  nombre: string;
  icono: string;
}

const roles: RolItem[] = [
  { id: 'atleta', nombre: 'Atleta', icono: '🏃‍♂️' },
  { id: 'entrenador', nombre: 'Entrenador', icono: '📋' },
  { id: 'tutor', nombre: 'Tutor', icono: '👪' },
  { id: 'voluntario', nombre: 'Voluntario', icono: '🤝' },
];

interface SelectorDeRolProps {
  alElegir: (rol: RolType) => void;
}

const SelectorDeRol: React.FC<SelectorDeRolProps> = ({ alElegir }) => {
  return (
    <div className="selector-container">
      <h2 className="selector-title">¿Quién se registra hoy?</h2>
      <div className="botonesDeRol">
        {roles.map((rol) => (
          <button
            key={rol.id}
            onClick={() => alElegir(rol.id)}
            className="botonRol"
            data-role={rol.id}
          >
            <span className="iconoRol">{rol.icono}</span>
            <span className="nombreRol">{rol.nombre}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectorDeRol;
