/* --- ENRUTADOR PRINCIPAL DEL PROYECTO --- */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import FormularioPages from '../pages/FormularioPages';
import NosotrosPages from '../pages/NosotrosPages';
import EventosPages from '../pages/EventosPages';
import VoluntariosPages from '../pages/VoluntariosPages';
import ContactoPages from '../pages/ContactoPages';
import EntrenadoresPage from '../pages/EntrenadoresPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PerfilPage from '../pages/PerfilPage';
import PlataformaRegistroPage from '../pages/PlataformaRegistroPage';
import PanelAdministrativo from '../components/Admin Dashboard/Panel-Administrativo';
import PrivateRoute from './PrivateRoute';
import ScrollToTop from '../components/ScrollToTop';

const Routing: React.FC = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePages />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/nosotros" element={<NosotrosPages />} />
            <Route path="/contacto" element={<ContactoPages />} />
            <Route path="/formulario" element={<FormularioPages />} />
            <Route path="/plataforma-registro" element={<PlataformaRegistroPage />} />
            <Route path="/eventos" element={<EventosPages />} />
            <Route path="/voluntarios" element={<VoluntariosPages />} />

            {/* Rutas Privadas - Protegidas por PrivateRoute */}
            <Route
                path="/admin"
                element={
                    <PrivateRoute>
                        <PanelAdministrativo />
                    </PrivateRoute>
                }
            />
            <Route
                path="/entrenadores"
                element={
                    <PrivateRoute>
                        <EntrenadoresPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/perfil"
                element={
                    <PrivateRoute>
                        <PerfilPage />
                    </PrivateRoute>
                }
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    );
};

export default Routing;
