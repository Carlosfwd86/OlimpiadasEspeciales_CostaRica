
/* --- ENRUTADOR PRINCIPAL DEL PROYECTO --- */
import React from 'react';
/* Importamos solo lo necesario, sin repetir */
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePages from '../pages/HomePages';
import FormularioPages from '../pages/FormularioPages';
import NosotrosPages from '../pages/NosotrosPages';
import EventosPages from '../pages/EventosPages';
import VoluntariosPages from '../pages/VoluntariosPages';
import ContactoPages from '../pages/ContactoPages';
import EntrenadoresPage from '../pages/EntrenadoresPage';
import LoginPage from '../pages/LoginPage';
import PerfilPage from '../pages/PerfilPage';
import PanelAdministrativo from '../components/Admin Dashboard/Panel-Administrativo';
import PrivateRoute from './PrivateRoute';


const Routing = () => {
    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePages />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/nosotros" element={<NosotrosPages />} />
            <Route path="/contacto" element={<ContactoPages />} />
            <Route path="/formulario" element={<FormularioPages />} />
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
    );
};

export default Routing;