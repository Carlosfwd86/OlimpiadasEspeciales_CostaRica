# 🏆 Plataforma Integral - Olimpiadas Especiales Costa Rica

Esta es la documentación principal de la plataforma de **Olimpiadas Especiales Costa Rica**, un sistema completo diseñado para la digitalización, registro y administración de atletas, entrenadores, tutores y voluntarios. El proyecto se compone de un cliente enriquecido (Frontend) y un servidor robusto con persistencia en base de datos e integración con Inteligencia Artificial (Backend).

---

## 📌 1. Estructura General del Repositorio

El proyecto está organizado en dos directorios principales:
* 📁 `Olimpiadas_Especiales/`: Código del cliente web desarrollado en **React, Vite y TypeScript**.
* 📁 `Backend/`: Servidor de API Restful desarrollado en **Node.js, Express y Sequelize (MySQL)**.

---

## 🏗️ 2. Tecnologías y Arquitectura

### Frontend
- **React 18 & TypeScript:** Estructura modular, tipado seguro y componentes reactivos.
- **Vite:** Empaquetador ultrarrápido para el desarrollo y producción.
- **React Router Dom v6:** Enrutamiento del lado del cliente y protección de rutas.
- **EmailJS:** Notificaciones directas por correo desde el cliente para confirmaciones de registro.

### Backend
- **Node.js & Express:** Servidor HTTP ligero y estructurado bajo el patrón de diseño MVC.
- **Sequelize ORM:** Gestor de base de datos relacional para MySQL con control de transacciones.
- **Multer:** Manejo y parseo de archivos directamente en memoria RAM (Buffer).
- **OpenAI Vision API:** Inteligencia Artificial (`gpt-4o-mini`) con **Structured Outputs** para la lectura y análisis automático de certificados médicos de atletas.

---

## 💻 3. Guía de Instalación y Ejecución

Asegúrate de tener instalado **Node.js** (versión 18 o superior) y una base de datos **MySQL** local activa.

### Paso 1: Configurar el Backend
1. Entra al directorio del servidor:
   ```bash
   cd Backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la carpeta `Backend/` basándote en la siguiente sección de Variables de Entorno.
4. Ejecuta las migraciones de la base de datos (incluye constraints CHECK) y arranca el servidor:
   ```bash
   npx sequelize-cli db:migrate
   node scripts/audit-check-constraints.js
   npm run dev
   ```
   Requiere **MySQL 8.0.16+**. Detalle de constraints CHECK: ver [ARCHITECTURE.md](./ARCHITECTURE.md#constraints-check-integridad-en-mysql).

### Paso 2: Configurar el Frontend
1. Abre una nueva consola y navega al directorio del cliente:
   ```bash
   cd Olimpiadas_Especiales
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en la dirección provista (normalmente `http://localhost:5173`).

---

## 🔑 4. Variables de Entorno Requeridas

Debes crear un archivo `.env` dentro de la carpeta `Backend/` con la siguiente estructura:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=tu_usuario_mysql
DB_PASS=tu_contrasena_mysql
DB_NAME=olimpiadas_db
DB_DIALECT=mysql
JWT_SECRET=escribe_aqui_una_clave_secreta_y_segura
NODE_ENV=development

# Clave de API de OpenAI para funciones de OCR y Chatbot
OPENAI_API_KEY=tu_openai_api_key_aqui
```

---

## 📊 5. Diagrama Entidad-Relación (ER)

El diseño lógico de la base de datos se encuentra documentado en la siguiente ruta:
📁 `docs/diagrama_er.png`

*(Los programadores o el evaluador pueden visualizar las relaciones entre las colecciones de usuarios, atletas, condiciones médicas, dispositivos, tutores y documentos en dicho diagrama).*

---

## 🎯 6. Colección de Postman e Integración de Endpoints

Para facilitar la verificación y el testing de todos los servicios, se incluye una colección de Postman exportada en la raíz del repositorio:
* 📂 **Archivo:** `Olimpiadas_Especiales_CostaRica.postman_collection.json`
* 📝 **Instrucciones:** Consulta la guía rápida de pruebas en [Postman_Consultas.md](./Postman_Consultas.md) para aprender a importar la colección y ejecutar las pruebas automáticas.

### Ejemplos Clave de Peticiones HTTP

#### A. Iniciar Sesión (Login)
* **Método:** `POST`
* **URL:** `{{base_url}}/api/auth/login`
* **Cuerpo (JSON):**
  ```json
  {
    "correo_electronico": "ejemplo@oe.cr",
    "contrasena": "ClaveSegura123!"
  }
  ```

#### B. OCR Inteligente de Certificados Médicos (Carga de Archivo)
* **Método:** `POST`
* **URL:** `{{base_url}}/api/certificados/analizar`
* **Headers:** `Content-Type: multipart/form-data`
* **Cuerpo (Form-Data):**
  * `certificado` (Tipo File / Imagen adjunta).

---

## 🎨 7. Decisiones de Diseño y Arquitectura

Para conocer a fondo la estructura de código limpio, el manejo transaccional de datos y las justificaciones técnicas sobre el uso de tecnologías de IA, por favor lee el documento de arquitectura del proyecto:
📄 **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---
**Desarrollado para Olimpiadas Especiales Costa Rica.**
