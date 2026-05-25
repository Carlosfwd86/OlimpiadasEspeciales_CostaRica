import React from 'react';
import type { RolType } from '../../types';
import { FormIcon, type FormIconName } from './FormIcons';
import "../../styles/Formulario/SelectorRoles.css";

interface RolItem {
  id: RolType;
  nombre: string;
  icono: FormIconName;
}

const roles: RolItem[] = [
  { id: 'atleta', nombre: 'Atleta', icono: 'runner' },
  { id: 'entrenador', nombre: 'Entrenador', icono: 'clipboard-form' },
  { id: 'tutor', nombre: 'Tutor', icono: 'family' },
  { id: 'voluntario', nombre: 'Voluntario', icono: 'handshake' },
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
            <span className="iconoRol">
              <FormIcon name={rol.icono} size={56} strokeWidth={1.75} />
            </span>
            <span className="nombreRol">{rol.nombre}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectorDeRol;
