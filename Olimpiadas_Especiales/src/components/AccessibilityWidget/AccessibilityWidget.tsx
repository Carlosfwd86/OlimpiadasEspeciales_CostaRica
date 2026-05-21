import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import './AccessibilityWidget.css';

const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFontSizeChange = (increment: number) => {
    let newSize = settings.fontSize + increment;
    if (newSize > 4) newSize = 4;
    if (newSize < 0) newSize = 0;
    updateSetting('fontSize', newSize);
  };

  return (
    <div className="a11y-widget-container" ref={widgetRef}>
      {/* Botón flotante */}
      <button 
        className="a11y-fab-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir panel de accesibilidad"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </svg>
      </button>

      {/* Menú expandible */}
      {isOpen && (
        <div className="a11y-panel" role="dialog" aria-label="Opciones de accesibilidad">
          <div className="a11y-panel-header">
            <h3>Accesibilidad</h3>
            <button className="a11y-close-btn" onClick={() => setIsOpen(false)} aria-label="Cerrar panel">✕</button>
          </div>

          <div className="a11y-panel-content">
            {/* Tamaño de texto */}
            <div className="a11y-option a11y-font-controls">
              <span className="a11y-label">🔤 Tamaño de Texto</span>
              <div className="a11y-font-btns">
                <button 
                  onClick={() => handleFontSizeChange(-1)} 
                  disabled={settings.fontSize === 0}
                  aria-label="Disminuir texto"
                >A-</button>
                <span className="a11y-font-level">{settings.fontSize}</span>
                <button 
                  onClick={() => handleFontSizeChange(1)} 
                  disabled={settings.fontSize === 4}
                  aria-label="Aumentar texto"
                >A+</button>
              </div>
            </div>

            {/* Toggles */}
            <ToggleOption 
              icon="🌓" label="Alto Contraste" 
              active={settings.highContrast} 
              onToggle={() => updateSetting('highContrast', !settings.highContrast)} 
            />
            <ToggleOption 
              icon="⬛" label="Escala de Grises" 
              active={settings.grayscale} 
              onToggle={() => updateSetting('grayscale', !settings.grayscale)} 
            />
            <ToggleOption 
              icon="🔗" label="Subrayar Enlaces" 
              active={settings.underlineLinks} 
              onToggle={() => updateSetting('underlineLinks', !settings.underlineLinks)} 
            />
            <ToggleOption 
              icon="🖱️" label="Cursor Grande" 
              active={settings.bigCursor} 
              onToggle={() => updateSetting('bigCursor', !settings.bigCursor)} 
            />
            <ToggleOption 
              icon="⏸️" label="Detener Animaciones" 
              active={settings.stopAnimations} 
              onToggle={() => updateSetting('stopAnimations', !settings.stopAnimations)} 
            />
            <ToggleOption 
              icon="📏" label="Guía de Lectura" 
              active={settings.readingGuide} 
              onToggle={() => updateSetting('readingGuide', !settings.readingGuide)} 
            />
            <ToggleOption 
              icon="🔠" label="Fuente para Dislexia" 
              active={settings.dyslexiaFont} 
              onToggle={() => updateSetting('dyslexiaFont', !settings.dyslexiaFont)} 
            />
          </div>

          <div className="a11y-panel-footer">
            <button className="a11y-reset-btn" onClick={resetSettings}>
              🔄 Restablecer Todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-componente para opciones de toggle
const ToggleOption = ({ icon, label, active, onToggle }: { icon: string, label: string, active: boolean, onToggle: () => void }) => (
  <button 
    className={`a11y-option-toggle ${active ? 'active' : ''}`} 
    onClick={onToggle}
    aria-pressed={active}
  >
    <div className="a11y-toggle-left">
      <span className="a11y-icon">{icon}</span>
      <span className="a11y-label">{label}</span>
    </div>
    <div className="a11y-switch">
      <div className="a11y-switch-knob"></div>
    </div>
  </button>
);

export default AccessibilityWidget;
