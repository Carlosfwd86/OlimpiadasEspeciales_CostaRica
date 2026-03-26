# 🏆 Olimpiadas Especiales Costa Rica - Plataforma de Gestión

Plataforma web integral diseñada para **Olimpiadas Especiales Costa Rica**, enfocada en la inclusión, accesibilidad y eficiencia en el registro de atletas con discapacidad intelectual y autismo, así como en la gestión administrativa de voluntarios, entrenadores y tutores.

---

## 🚀 Funcionalidades Principales

### 1. Sistema de Registro Integral (Stepper)
Un proceso guiado paso a paso para diferentes perfiles:
- **Atletas**: Captura de datos personales, información médica detallada (condiciones, medicamentos, alergias), disciplina deportiva y carga de documentos (ID, Certificado Médico).
- **Entrenadores / Voluntarios / Tutores**: Formularios específicos para cada rol con validación de datos.

### 2. Panel Administrativo (Dashboard)
Una herramienta potente para la gestión en tiempo real:
- **Estadísticas Dinámicas**: Visualización de total de registros, atletas activos, revisiones pendientes y voluntarios.
- **Gestión de Registros**: Tabla interactiva con búsqueda inteligente, filtros por deporte/región y acciones rápidas (Aprobar/Editar).
- **Validaciones Avanzadas**: Control estricto de campos obligatorios, formatos de correo y teléfono para garantizar la calidad de los datos.
- **Gráficos de Análisis**: Distribución de atletas por deporte y región (Charts).

### 3. Diseño Centrado en la Accesibilidad
- **Paleta de Colores**: Basada en los colores oficiales (Rojo, Azul, Blanco) con alto contraste.
- **Tipografía**: Uso de *Outfit* e *Inter* para máxima legibilidad.
- **Interactividad**: Micro-animaciones y efectos hover para una experiencia premium.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos**: Vanilla CSS (Arquitectura modular)
- **Iconografía**: [FontAwesome 6](https://fontawesome.com/)
- **Notificaciones**: [SweetAlert2](https://sweetalert2.github.io/)
- **Envío de Emails**: [@emailjs/browser](https://www.emailjs.com/)
- **Base de Datos (Mock)**: [JSON Server](https://github.com/typicode/json-server)

---

## 📦 Estructura del Proyecto

```text
src/
├── components/          # Componentes reutilizables (Navbar, Sidebar, Modals)
│   ├── Formulario/      # Formularios de registro por pasos
│   └── ...              # Componentes del Dashboard Administrativo
├── pages/               # Vistas principales (Home, Login, Dashboard)
├── services/            # Lógica de comunicación con la API (Fetch)
├── styles/              # Archivos CSS organizados por módulos
├── assets/              # Imágenes y recursos estáticos
└── routes/              # Configuración de rutas (React Router)
```

---

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone [url-del-repositorio]
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de datos (API Mock)**:
   Asegúrate de tener `json-server` instalado o usa `npx`:
   ```bash
   npx json-server --watch db.json --port 3001
   ```

4. **Ejecutar la aplicación en modo desarrollo**:
   ```bash
   npm run dev
   ```

---

## 📝 Notas del Desarrollador
- El sistema utiliza **JSON Server** en el puerto `3001` para simular el backend.
- Se ha implementado un sistema de **validación en tiempo real** en el panel administrativo para evitar "campos vacíos" y errores de formato.
- La plataforma es totalmente responsiva y está optimizada para dispositivos móviles y de escritorio.


