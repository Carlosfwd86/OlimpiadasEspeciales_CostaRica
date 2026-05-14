import React, { useState, useEffect } from 'react';
import { getEntrenadores, createEntrenador, deleteEntrenador } from '../services/ServicesEntrenadores';
import '../styles/Entrenadores.css';
import type { Entrenador } from '../types';

interface EntrenadorFormData {
  nombre: string;
  apellidos: string;
  especialidad: string;
  correo: string;
  telefono: string;
}

function Entrenadores(): React.JSX.Element {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<EntrenadorFormData>({
    nombre: '',
    apellidos: '',
    especialidad: '',
    correo: '',
    telefono: ''
  });

  useEffect(() => {
    cargarEntrenadores();
  }, []);

  const cargarEntrenadores = async (): Promise<void> => {
    try {
      const data = await getEntrenadores();
      setEntrenadores(data as Entrenador[]);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar entrenadores:', error);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await createEntrenador(formData as unknown as Omit<Entrenador, 'id'>);
      setFormData({
        nombre: '',
        apellidos: '',
        especialidad: '',
        correo: '',
        telefono: ''
      });
      cargarEntrenadores();
      alert('Entrenador registrado exitosamente');
    } catch (error) {
      console.error('Error al registrar entrenador:', error);
      alert('Hubo un error al registrar el entrenador');
    }
  };

  const handleDelete = async (id: string | number): Promise<void> => {
    if (window.confirm("¿Está seguro de que desea eliminar este entrenador?")) {
      try {
        await deleteEntrenador(id);
        cargarEntrenadores();
      } catch (error) {
        console.error('Error al eliminar entrenador:', error);
      }
    }
  };

  return (
    <div className="entrenadores-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard de Entrenadores</h1>
        <p>Gestión y registro de entrenadores de Olimpiadas Especiales</p>
      </div>

      <div className="dashboard-content">
        <div className="form-container">
          <h2>Registrar Entrenador</h2>
          <form className="entrenador-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                placeholder="Nombre del entrenador"
              />
            </div>
            
            <div className="form-group">
              <label>Apellidos</label>
              <input 
                type="text" 
                name="apellidos" 
                value={formData.apellidos} 
                onChange={handleChange} 
                required 
                placeholder="Apellidos"
              />
            </div>

            <div className="form-group">
              <label>Especialidad</label>
              <select 
                name="especialidad" 
                value={formData.especialidad} 
                onChange={handleChange} 
                required
              >
                <option value="">Seleccione un deporte...</option>
                <option value="Atletismo">Atletismo</option>
                <option value="Natación">Natación</option>
                <option value="Fútbol">Fútbol</option>
                <option value="Baloncesto">Baloncesto</option>
                <option value="Tenis">Tenis</option>
                <option value="Gimnasia">Gimnasia</option>
                <option value="Bochas">Bochas</option>
                <option value="Levantamiento de Potencia">Levantamiento de Potencia</option>
              </select>
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                name="correo" 
                value={formData.correo} 
                onChange={handleChange} 
                required 
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input 
                type="tel" 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
                required 
                placeholder="8888-8888"
              />
            </div>

            <button type="submit" className="btn-submit">
              Registrar Entrenador
            </button>
          </form>
        </div>

        <div className="list-container">
          <h2>
            Entrenadores Activos
            <span className="badge-count">{entrenadores.length}</span>
          </h2>
          
          {loading ? (
            <div className="loading-state">Cargando entrenadores...</div>
          ) : entrenadores.length === 0 ? (
            <div className="empty-state">No hay entrenadores registrados aún.</div>
          ) : (
            <div className="entrenadores-grid">
              {entrenadores.map((entrenador: any) => (
                <div key={entrenador.id} className="entrenador-card">
                  <div className="entrenador-header">
                    <h3>{entrenador.nombre} {entrenador.apellidos}</h3>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(entrenador.id)}
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="entrenador-info">
                    <p><strong>Deporte:</strong> {entrenador.especialidad}</p>
                    <p><strong>Correo:</strong> {entrenador.correo}</p>
                    <p><strong>Teléfono:</strong> {entrenador.telefono}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Entrenadores;
