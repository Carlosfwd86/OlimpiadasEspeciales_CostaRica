# 🏗️ Documento de Arquitectura y Decisiones de Diseño

Este documento detalla la arquitectura de software, los patrones de diseño y las decisiones técnicas clave adoptadas para el desarrollo de la plataforma de **Olimpiadas Especiales Costa Rica**.

---

## 1. Vista General del Sistema

El sistema implementa una arquitectura **Cliente-Servidor** desacoplada:
* **Frontend (Cliente):** Una Single Page Application (SPA) construida sobre React que se comunica mediante llamadas REST asíncronas utilizando `fetch` y `axios`.
* **Backend (Servidor de API):** Un servidor HTTP RESTful desarrollado sobre Node.js y Express, con persistencia relacional administrada por Sequelize ORM sobre MySQL.

---

## 2. Patrones de Diseño y Estructura en el Backend

El backend se rige bajo principios de **Clean Architecture** y sigue el patrón de diseño **MVC (Modelo-Vista-Controlador)** para garantizar alta mantenibilidad, escalabilidad y separación de responsabilidades:

### A. Middlewares (Filtros y Pre-procesamiento)
Los middlewares actúan como interceptores secuenciales en la tubería de peticiones:
* **Autenticación (`authMiddleware.js`):** Valida la presencia e integridad del token JWT, inyectando el payload del usuario autenticado en el objeto `req.user`.
* **Validación de Roles (`roleMiddleware.js`):** Restringe accesos según el rol (ej: restringir la creación y modificación de atletas solo a administradores).
* **Gestión de Archivos (`manejoArchivos.js`):** Configurado con **Multer en memoria (`multer.memoryStorage()`)**. Esta decisión de diseño evita escribir archivos basura o temporales directamente en el disco duro del servidor web, eliminando riesgos de agotamiento de almacenamiento y permitiendo procesar el flujo binario (Buffer) directamente en memoria RAM hacia la API de OpenAI.

### B. Servicios (Lógica del Dominio e Integraciones de Terceros)
* **Servicio OCR (`servicioOcr.js`):** Aísla por completo las dependencias y claves de acceso de la API de OpenAI. Los controladores no conocen cómo opera el LLM, simplemente le suministran el Buffer del archivo y obtienen el resultado estructurado.

### C. Controladores (Orquestadores de Negocio)
* Los controladores (ej. `atletaController.js`, `certificadoController.js`) capturan la solicitud HTTP, invocan las validaciones semánticas, orquestan el comportamiento del negocio y devuelven respuestas HTTP estandarizadas (`JSON`).

### D. Modelos e Integridad Transaccional (Sequelize)
* Para garantizar que las operaciones complejas de base de datos sean atómicas, se implementaron **Transacciones SQL** en Sequelize (ej: al crear un atleta en `crearAtleta`). Si la creación de condiciones médicas, dispositivos o medicamentos del atleta falla a mitad del proceso, se ejecuta un `t.rollback()`, garantizando que la base de datos nunca quede en un estado inconsistente o huérfano.

---

## 3. Decisiones Clave sobre Inteligencia Artificial (RF-07)

Se implementó el uso del modelo de visión multimodal `gpt-4o-mini` de OpenAI para el procesamiento de certificados médicos. Las decisiones técnicas clave fueron:

* **Structured Outputs (Salidas Estructuradas JSON):** En lugar de enviar un prompt convencional y esperar que la IA responda con texto libre (que puede variar de formato), se utiliza la funcionalidad de **JSON Schema estricto** provista por OpenAI. Esto garantiza que la respuesta del servidor de IA siempre cumpla con el formato exacto `{ "nombre_atleta": "string", "fecha_vencimiento": "string" }`, evitando fallos al parsear del lado del servidor.
* **Cálculo de Vigencia Dinámico (Lógica de Negocio):** Se programó a la IA mediante instrucciones del sistema (*System Prompt*) para procesar dos escenarios de negocio:
  1. Si el documento tiene fecha de vencimiento explícita, se extrae directamente.
  2. Si solo tiene fecha de emisión, el modelo calcula automáticamente el vencimiento sumando exactamente un año a partir de esa fecha.

---

## 4. Funcionalidades Avanzadas de Base de Datos (RF-05)

Para optimizar las consultas y evitar sobrecargar la transferencia de datos:
* **Búsqueda por Texto Integrada:** Se implementó mediante operadores lógicos `Op.or` y filtros parciales `Op.like` en Sequelize sobre los campos clave de la tabla de atletas (`nombre`, `primer_apellido`, `segundo_apellido`, `cedula`).
* **Filtros Exactos y Ordenamiento Dinámico:** Se delegan los filtros por género/país y el ordenamiento (columna y dirección ASC/DESC) directamente a la base de datos relacional MySQL, optimizando significativamente la velocidad de respuesta en comparación con ordenar la lista completa de objetos en JavaScript en el cliente.

---
**Equipo de Desarrollo de Olimpiadas Especiales Costa Rica.**
