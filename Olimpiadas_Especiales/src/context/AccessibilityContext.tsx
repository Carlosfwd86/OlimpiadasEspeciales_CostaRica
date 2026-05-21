import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityState {
  fontSize: number;
  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  bigCursor: boolean;
  stopAnimations: boolean;
  readingGuide: boolean;
  dyslexiaFont: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilityState;
  updateSetting: (key: keyof AccessibilityState, value: boolean | number) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilityState = {
  fontSize: 0,
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  bigCursor: false,
  stopAnimations: false,
  readingGuide: false,
  dyslexiaFont: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilityState>(() => {
    const saved = localStorage.getItem('a11y-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('a11y-settings', JSON.stringify(settings));

    // Aplicar clases globales a HTML (documentElement) para mejor escalado y aislamiento
    const root = document.documentElement;
    
    // Limpiar clases de fuente anteriores
    root.className = root.className.replace(/\ba11y-font-size-\S+/g, '');
    if (settings.fontSize > 0) {
      root.classList.add(`a11y-font-size-${settings.fontSize}`);
    }

    root.classList.toggle('a11y-high-contrast', settings.highContrast);
    root.classList.toggle('a11y-grayscale', settings.grayscale);
    root.classList.toggle('a11y-underline-links', settings.underlineLinks);
    root.classList.toggle('a11y-big-cursor', settings.bigCursor);
    root.classList.toggle('a11y-stop-animations', settings.stopAnimations);
    root.classList.toggle('a11y-dyslexia-font', settings.dyslexiaFont);

  }, [settings]);

  // Lógica de la Guía de Lectura
  useEffect(() => {
    if (!settings.readingGuide) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const guide = document.getElementById('a11y-reading-guide-line');
      if (guide) {
        guide.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.readingGuide]);

  // Atajo de emergencia: Ctrl + Q para resetear
  useEffect(() => {
    const handleEmergencyReset = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        setSettings(defaultSettings);
      }
    };
    window.addEventListener('keydown', handleEmergencyReset);
    return () => window.removeEventListener('keydown', handleEmergencyReset);
  }, []);

  const updateSetting = (key: keyof AccessibilityState, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
      {settings.readingGuide && <div className="a11y-reading-guide-line" id="a11y-reading-guide-line"></div>}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility debe ser utilizado dentro de un AccessibilityProvider');
  }
  return context;
};
