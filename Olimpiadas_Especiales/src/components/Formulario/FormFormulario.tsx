import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import SelectorDeRol from './SelectorDeRol';
import FormAtleta from './FormAtleta';
import FormEntrenador from './FormEntrenador';
import FormTutor from './FormTutor';
import FormVoluntario from './FormVoluntario';
import type { RolType } from '../../types';

const FormFormulario: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [rol, setRol] = useState<RolType | null>(searchParams.get('rol') as RolType | null);

  useEffect(() => {
    const rolParam = searchParams.get('rol') as RolType | null;
    if (rolParam) setRol(rolParam);
  }, [searchParams]);

  return (
    <div className="pagina_formulario_layout">
      <Navbar />
      <div id="form-inicio">
        {!rol && <SelectorDeRol alElegir={setRol} />}
        {rol === 'atleta' && <FormAtleta onVolver={() => setRol(null)} />}
        {rol === 'entrenador' && <FormEntrenador onVolver={() => setRol(null)} />}
        {rol === 'tutor' && <FormTutor onVolver={() => setRol(null)} />}
        {rol === 'voluntario' && <FormVoluntario onVolver={() => setRol(null)} />}
      </div>
      <Footer />
    </div>
  );
};

export default FormFormulario;
