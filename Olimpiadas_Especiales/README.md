# 🏆 Plataforma Integral - Olimpiadas Especiales Costa Rica

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![JSON Server](https://img.shields.io/badge/JSON_Server-Mock_DB-333333?style=for-the-badge&logo=json&logoColor=white)

## 📌 1. Visión General del Proyecto

La plataforma web de **Olimpiadas Especiales Costa Rica** es una aplicación moderna de tipo *Single Page Application* (SPA) diseñada para centralizar, agilizar y digitalizar el proceso de inscripción y gestión de personal involucrado en la organización. 

Está desarrollada bajo un enfoque de **Alta Accesibilidad y Diseño Inclusivo**, permitiendo a diferentes tipos de usuarios interactuar con un sistema de perfiles y formularios adaptables a sus realidades médicas, edades y documentos legales requeridos. La plataforma está pensada no solo como una "página web", sino como un sistema completo de logística para el área deportiva y administrativa.

---

## 🏗 2. Arquitectura de Software y Tecnologías

El proyecto se dividió en dos partes esenciales (Frontend y Backend Mock):

### Frontend (Vista Cliente)
- **Core de Desarrollo:** React 18, empaquetado y servido de forma ágil usando Vite. Vite provee un *Hot Module Replacement* (HMR) extremadamente rápido.
- **Rutas (Routing):** `react-router-dom` v6 se encarga de la protección de rutas, permitiendo discernir entre vistas públicas (Landing, Nosotros, Contacto) y privadas (Perfil, Dashboards).
- **Estilos:** Se utilizó CSS Puro bajo principios modernos de *Glassmorphism*, Variables de Diseño globales, CSS Modules y Flexbox/CSS Grid.
- **Interfaz y UI:** 
  - `SweetAlert2` reemplaza a los "alerts" comunes del navegador, dotando a la app de modales interactivos para confirmaciones, errores y visualización de imágenes interactivas.
- **Servicios Externos:** 
  - `EmailJS` se emplea para la automatización de correos electrónicos transaccionales directos al cliente (Verificaciones de cuenta y notificaciones de registro a eventos).

### Backend Mock (Base de Datos Local)
- **JSON Server:** Una utilidad que mapea el archivo físico `db.json` convirtiéndolo al vuelo en una API Restful real (GET, POST, PUT, DELETE, PATCH).
- **Almacenamiento Base64:** Los documentos sensibles e imágenes subidas al perfil o a los registros (Cédulas, consentimientos, títulos) se pre-procesan en la vista cliente como Strings de `Base64` y se guardan directamente en el JSON para permitir su posterior trazabilidad óptica e interactiva.

---

## 📂 3. Estructura Exhaustiva de Directorios

\`\`\`text
Olimpiadas_Especiales/
├── public/                 # Favicons y recursos generales a inyectar al index.html
├── db.json                 # ¡EL CORAZÓN DE DATOS! Mock DB que emula el Backend.
├── package.json            # Gestor de dependencias e información de macros.
├── src/
│   ├── assets/             # Recursos estáticos: Logos institucionales, medallas e infografías.
│   │
│   ├── components/         # PIEZAS REUTILIZABLES DE LA APLICACIÓN
│   │   ├── Navbar.jsx / Footer.jsx # Componentes Maestros Universales.
│   │   ├── BannerVoluntarios.jsx   # Botoneras flotantes y CTAs estratégicos.
│   │   ├── CarouselEventos.jsx     # Tarjetas lógicas que renderizan eventos activos.
│   │   ├── InfografiaImpacto.jsx   # Sección de estadísticas animadas de Home.
│   │   ├── FormPerfil.jsx          # Panel Digital del usuario Logueado.
│   │   │
│   │   └── Formulario/     # LOGÍSTICA DE INSCRIPCIONES (CORE)
│   │       ├── FormAtleta.jsx      # Form paso-a-paso de salud y tutela.
│   │       ├── FormEntrenador.jsx  # Form basado en acreditaciones oficiales y experiencia.
│   │       ├── FormVoluntario.jsx  # Registro de apoyo logístico puro (Requiere chequeos penales).
│   │       └── FormTutor.jsx       # Form restrictivo familiar con vinculación de atletas.
│   │
│   ├── pages/              # Mapeo Superior de las Rutas (Vistas completas si se requiere).
│   │
│   ├── routes/             
│   │   └── Routing.jsx     # Archivo centralizador donde se protegen/exponen los paths de URL.
│   │
│   ├── services/           # CONTROLADORES DE BASE DE DATOS E INTERNET
│   │   ├── ServicesAdmin.js        # Dashboard queries globales.
│   │   ├── ServicesAtletas.js      # ABMs exclusivos a la tabla /atletas.
│   │   ├── ServicesUsuarios.js     # Manejo de usuarios base y autenticación.
│   │   ├── ServicesEventos.js      # Injección de JSON a la cartelera de Home.
│   │   ├── ServicesConfig.js       # Variables institucionales configurables.
│   │   └── ... 
│   │
│   └── styles/             # Modularidad Estética por Componente.
│       ├── Formulario/     # Hojas de estilo pesadas para inputs y modales form.
│       ├── Admin.css       # Layouts rígidos para data-tables.
│       └── globals/index.css # Variables nativas CSS (--rojo-primario, etc).
\`\`\`

---

## 🧩 4. Características y Módulos a Detalle

### Módulo de Identidad y Autenticación (Login / Register)
El flujo fue programado para que un usuario pueda crearse una **Cuenta Básica**. Esa cuenta vive en `localStorage ('usuarioSesion')`. Posteriormente, al navegar a `/plataforma-registro`, el sistema autodetecta qué registros ya llenó el usuario (Mediante condicionales que iteran tablas especializadas cruzando el Email del usuario) mostrando *Checks de completitud* dinámicos e impidiendo duplicidades de registro. 

### Módulo de "Smart-Forms" de 4 Pasos
La inscripción al club NO es estática, se divide en vistas (Paginación interna gestionada por `Estados React` locales) donde:
- **Paso 1:** Personales, cálculo milimétrico de edad y protección a menores.
- **Paso 2:** Historial de diagnósticos, alergias y encuestas en cascada (Si una persona marca "Sí tengo alergias", se liberan inputs condicionales para obligar a detallarlas).
- **Paso 3:** Deporte u Ocupación, historial de clubes y años de práctica.
- **Paso 4:** Archivos Requisitos. Aquí el componente `FileReader` capta los archivos (PDF/JPG/PNG), valida su peso (<5MB), los convierte a un string plano `Base64` incrustándolos permanentemente a la solicitud final y despacha un correo automatizado de seguridad al cliente vía *EmailJS*.

### Módulo Visor de Perfil Moderno
El componente `FormPerfil.jsx` fue reescrito para emular una tarjeta de presentación oficial médica/deportiva:
- Permite subir una fotografía facial que automáticamente comprime la densidad de pixeles al tamaño exacto utilizando `HTML Canvas`.
- Lee las enfermedades y los arreglos de discapacidades desde la BDD adaptándolos de forma pulcra a pantalla.
- Renderiza las "Tarjetas de Archivos Adjuntados" (Ej: **🪪 Cédula Identidad**), las cuales interceptan Clicks para renderizar el código `Base64` directamente simulando un "Visor Documental" avanzado usando **SweetAlert2 (Iframes y etiquetas Image)**.

### Módulo Administrativo Global
El sistema tiene integrado utilidades para un "Usuario Administrador" el cual posee poderes sobre la plataforma:
- Revisar a los Atletas/Entrenadores "Pendientes" mediante colorimetría. 
- Aprobar acreditaciones oficiales o rechazarlas enviándoles correos automáticos.
- Administrar contenido de la página, por ejemplo, actualizar Textos de contacto del Footer sin necesidad de que interceda un programador de código directamente.

---

## 🔒 5. Estrategias de Validación del Proyecto

1. **Validación de Edad Dinámica:** Función estricta que convierte la `fechaNacimiento` en formato ISO, restándole precisión de milisegundos a la fecha `Date.now()`. Si en los formularios de Tutores, Voluntarios o Entrenadores el resultado es `< 18`, el modal te castiga y redirige sin permitirte registrarte.
2. **Excepciones de Atletas:** Si un Atleta sub de 18 aplica a entrar de forma autónoma, el "Paso 1" detecta tu edad en tiempo real mostrando obligatoriamente un subtítulo rojo exigiendo toda la información legal de tu encargado actual, de lo contrario bloquea el código.
3. **Validación Transaccional de Integridad Múltiple:** El usuario no puede inscribirse simultáneamente a roles como *Entrenador* si ya posee una solicitud abierta.

---

## 📝 6. Estructura de Rutas de la API (JSON Server)

Nuestra base de datos relacional simulada (db.json) cuenta interconectividad mediante Claves ID a las siguientes colecciones:
- `/usuarios` (Autenticador primario)
- `/atletas` (Propiedad extendida de un usuario)
- `/tutores` 
- `/entrenadores` 
- `/voluntarios` 
- `/eventos` (Listado en arrays consumido universalmente)
- `/noticias_carousel` (Banners Dinámicos Home)
- `/configuracion` (Ajustes maestros del sistema)

---

## 💻 7. Guía de Arranque y Despliegue en 5 Pasos

Para auditar y trabajar en esta obra de arte en su computadora, tiene que asegurar descargar un motor instalador JavaScript en su computadora, de la mano de Node.JS. Posteriormente asegúrese de configurar su servidor de esta manera:

**Paso 1:** Ingrese hacia la raíz del proyecto usando su terminal.
\`\`\`bash
cd Olimpiadas_Especiales
\`\`\`

**Paso 2:** Instale de manera contundente las dependencias para que React pueda funcionar (Los paquetes de `SweetAlert2`, `React Router Dom` y `Email JS`).
\`\`\`bash
npm install
\`\`\`

**Paso 3:** Deberá encender la Máquina de Simulacro del JSON Server ejecutando las banderas `--watch` para aplicar Hot-Reloads por la BDD. Asegúrese que obligue el puerto 3001. En la consola A:
\`\`\`bash
npx json-server --watch db.json --port 3001
\`\`\`

**Paso 4:** Abra simultáneamente una **Segunda Consola/Terminal** en el mismo lugar, en esta lanzará el core virtual de **Vite/React**:
\`\`\`bash
npm run dev
\`\`\`

**Paso 5:** Vite le escupirá el resultado final y le otorgará el clásico enlace `http://localhost:5173`. Dele un `Ctrl + Click` para ingresar a la plataforma y disfrute navegando en base al ecosistema de credenciales locales.

---

## 📦 8. Compilación para Puesta en Producción

Cuando la plataforma web sea aprobada por Olimpiadas Especiales para su hosteo en dominios estáticos (Vercel, AWS S3, Hostinger), el empaquetado final se da usando:

\`\`\`bash
npm run build
\`\`\`

Lo cual traducirá todo el inmenso conglomerado de `assets`, `JSX` y `Estados Reactivos` hacia versiones ultraligeras y minificadas de `index.html`, `js` y `css` listas para el acceso de velocidad real de Caching al público en general en la carpeta de salida `/dist`.

(*Notese que si esto fuese exportado, la emulación REST de json-server requerirá que el `db.json` se migre a un backend de la envergadura de Firebase, Postgresql/NestJS, o MongoDB/Express* para soportar la masividad requerida del verdadero entorno).

---

## 🤖 9. RF-07 | Integración de Inteligencia Artificial al Proyecto

La plataforma incorpora habilidades clave de Inteligencia Artificial en el backend para automatizar procesos administrativos y enriquecer la experiencia de usuario:

### 📑 OCR con Visión e IA para Certificados Médicos (Automatización & Integración)
- **Habilidad Seleccionada:** Conexión del backend con modelos de lenguaje multimodal (LLMs) y técnicas de Visión Artificial para la extracción estructurada de datos (Structured Outputs).
- **Por qué se seleccionó:** En Olimpiadas Especiales Costa Rica, la validación de certificados médicos de atletas es un proceso crítico y manual que suele retrasar las inscripciones. Esta solución automatiza el registro de datos reduciendo la carga administrativa.
- **Cómo se integra:** Se desarrolló un flujo en el backend (`Node.js`/`Express`) que intercepta la subida de un certificado. Utilizando el modelo de visión `gpt-4o-mini` de OpenAI y un esquema estricto de validación JSON, la IA extrae de forma autónoma el nombre completo del atleta y calcula o lee la fecha exacta de vencimiento del documento (sumando un año si solo detecta la fecha de emisión).
- **Cómo puede verificarse/probarse:** 
  1. Enviar una petición HTTP `POST` a `/api/certificados/analizar` adjuntando un certificado médico (imagen JPG, PNG o WEBP) bajo el parámetro `certificado` en formato `multipart/form-data`.
  2. El sistema responderá automáticamente con un JSON estructurado que incluye `{ nombre_atleta, fecha_vencimiento }` detectados por la IA en segundos.

### 💬 Asistente Conversacional Inteligente (Agentes & LLMs)
- **Habilidad Seleccionada:** Agente conversacional integrado directamente con APIs de Inteligencia Artificial.
- **Por qué se seleccionó:** Brinda a los usuarios y administradores un canal de soporte interactivo y dinámico para evacuar dudas relacionadas con salud, disciplinas y reglamentos de Olimpiadas Especiales de forma inmediata.
- **Cómo se integra:** Expuesto en el endpoint `/api/chat`, procesa las consultas conversacionales interactuando de forma reactiva con el frontend para responder con coherencia al contexto del usuario.
- **Cómo puede verificarse/probarse:** Interactuando con el componente del Chatbot en la interfaz, enviando consultas relacionadas con la logística del torneo o salud preventiva.

---
**Desarrollado y Orquestado para Olimpiadas Especiales Costa Rica.**
