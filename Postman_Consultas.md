# 🚀 Documentación de Consultas y Colección de Postman

Esta guía explica cómo importar y utilizar la colección de Postman configurada para el proyecto **Olimpiadas Especiales Costa Rica**. El archivo de colección se encuentra en la raíz del repositorio con el nombre:
📂 `Olimpiadas_Especiales_CostaRica.postman_collection.json`

---

## 📥 ¿Cómo importar la colección en Postman?

1. Abre **Postman**.
2. Haz clic en el botón **Import** (esquina superior izquierda).
3. Selecciona o arrastra el archivo `Olimpiadas_Especiales_CostaRica.postman_collection.json` de la raíz del proyecto.
4. ¡Listo! La colección aparecerá en tu barra lateral izquierda.

---

## ⚙️ Configuración de Variables en Postman

La colección viene pre-configurada con variables globales:
- **`base_url`**: Por defecto apunta a `http://localhost:3000`. Si usas otro puerto, puedes modificarla en la pestaña *Variables* de la colección.
- **`token`**: Se encarga de almacenar tu token de autenticación (JWT). 

> 💡 **Guardado Automático de Token:** Al realizar una petición exitosa a **Iniciar Sesión (Login)**, un script de Postman guardará automáticamente el JWT retornado en la variable `{{token}}`. No necesitas copiar y pegar el token manualmente para las peticiones protegidas.

---

## 🛣️ Detalle de Endpoints Disponibles

La colección se encuentra estructurada en 4 carpetas principales:

### 1. Autenticación (`/api/auth`)
* **Registrar Usuario (`POST /register`):** Permite registrar una nueva cuenta base.
* **Iniciar Sesión (`POST /login`):** Valida credenciales y genera el token de sesión (lo guarda automáticamente en Postman).
* **Obtener Usuario Actual (`GET /me`):** Verifica si hay una sesión activa y retorna el payload descifrado del JWT.
* **Obtener Perfil Completo (`GET /profile`):** Retorna la información extendida del perfil del usuario (requiere autenticación).
* **Cerrar Sesión (`POST /logout`):** Invalida el token activo.

### 2. Atletas (`/api/atletas`)
* **Listar todos los Atletas (`GET /`):** Retorna la lista completa de atletas con sus condiciones médicas, alergias, medicamentos, dispositivos y documentos adjuntos.
* **Búsqueda por Texto (`GET /?buscar=texto`):** Filtra coincidencias parciales de texto en el nombre, primer apellido, segundo apellido o cédula.
* **Filtros por Campo (`GET /?genero=M&pais=Costa Rica`):** Filtra atletas por valores de igualdad exacta.
* **Ordenamiento Dinámico (`GET /?ordenarPor=fecha_nacimiento&orden=DESC`):** Ordena la base de datos de atletas dinámicamente por la columna elegida.
* **Obtener Atleta por ID (`GET /:id`):** Consulta a un atleta específico.
* **Crear Atleta (`POST /`):** Inserta un atleta nuevo vinculando transaccionalmente alergias, dispositivos y medicamentos (solo administradores).
* **Actualizar Atleta (`PUT /:id`):** Actualiza campos específicos del atleta.
* **Eliminar Atleta (`DELETE /:id`):** Remueve físicamente a un atleta y su historial relacionado.

### 3. OCR Certificados - IA (`/api/certificados`)
* **Analizar Certificado Médico (`POST /analizar`):** 
  * Envía un archivo de imagen en formato `multipart/form-data` bajo el campo `certificado`.
  * El backend procesa el archivo con Inteligencia Artificial de Visión (`gpt-4o-mini`) y responde con un JSON estructurado conteniendo el nombre completo y la fecha de vencimiento calculada de manera autónoma.

### 4. Chatbot Inteligente (`/api/chat`)
* **Enviar Consulta (`POST /`):**
  * Envía un JSON con un mensaje conversacional (`{ "message": "..." }`) para interactuar con la lógica del asistente de salud y prevención de Olimpiadas Especiales.

---
**Equipo de Desarrollo de Olimpiadas Especiales Costa Rica.**
