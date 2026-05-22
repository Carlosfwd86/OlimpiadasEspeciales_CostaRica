# API — Olimpiadas Especiales Costa Rica

Referencia de todos los endpoints del backend Express. Base URL por defecto:

```
http://localhost:3000/api/v1
```

## Autenticación

El token JWT se envía de una de estas formas:

| Método | Ejemplo |
|--------|---------|
| Cookie | `token` (se establece en login) |
| Header | `Authorization: Bearer <token>` |

**Roles:** `rol_id: 1` = Administrador. Las rutas marcadas como **Admin** exigen `checkRole([1])`.

---

## Índice rápido

| Módulo | Prefijo |
|--------|---------|
| [Autenticación](#autenticación-auth) | `/auth` |
| [Usuarios](#usuarios) | `/usuarios` |
| [Admin](#admin) | `/admin` |
| [Atletas](#atletas) | `/atletas` |
| [Competiciones](#competiciones) | `/competiciones` |
| [Competiciones–Atletas](#competiciones-atletas) | `/competiciones-atletas` |
| [Consultas / contacto](#consultas) | `/consultas` |
| [Disciplinas](#disciplinas) | `/disciplinas` |
| [Entrenadores](#entrenadores) | `/entrenadores` |
| [Inscripciones](#inscripciones) | `/inscripciones` |
| [Niveles de habilidad](#niveles-de-habilidad) | `/niveles-habilidad` |
| [Programas](#programas) | `/programas` |
| [Roles](#roles) | `/roles` |
| [Tutores](#tutores) | `/tutores` |
| [Voluntarios](#voluntarios) | `/voluntarios` |
| [Áreas de voluntariado](#áreas-de-voluntariado) | `/voluntarios-areas` |
| [Estadísticas](#estadísticas) | `/stats` |
| [Configuración](#configuración) | `/settings` |
| [Registros pendientes](#registros-pendientes) | `/registros-pendientes` |
| [Actividad del sistema](#actividad-del-sistema) | `/actividades-sistema` |
| [Chat (sitio web)](#chat) | `/chats` |
| [Inteligencia artificial](#inteligencia-artificial) | `/ia` |

---

## Autenticación (`/auth`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/register` | No | Registrar usuario |
| `POST` | `/login` | No | Iniciar sesión (devuelve token) |
| `POST` | `/logout` | No* | Cerrar sesión |
| `POST` | `/forgot-password` | No | Solicitar recuperación de contraseña |
| `POST` | `/reset-password` | No | Restablecer contraseña con token |
| `GET` | `/me` | Opcional | Sesión actual (`{ usuario }` o `null`) |
| `GET` | `/profile` | Sí | Perfil del usuario autenticado |
| `PATCH` | `/profile` | Sí | Actualizar perfil |

**Ejemplo login**

```json
POST /api/v1/auth/login
{
  "correo_electronico": "admin@olimpiadas.cr",
  "contrasena": "Admin1234!"
}
```

---

## Usuarios (`/usuarios`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/?correo_electronico=` | No | Buscar por correo (requiere query) |
| `GET` | `/all` | Admin | Listar todos los usuarios |
| `GET` | `/:id` | Sí | Usuario por ID |
| `PATCH` | `/:id` | Sí | Actualizar usuario |
| `DELETE` | `/:id` | Admin | Eliminar usuario |

**Query paginación:** `page`, `limit`

---

## Admin (`/admin`)

Todas requieren **Admin**.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/registros_pendientes` | Registros pendientes de aprobación |
| `GET` | `/stats` | Estadísticas del panel |
| `GET` | `/graficos` | Datos para gráficos |

---

## Atletas (`/atletas`)

Todas requieren autenticación. Escritura solo **Admin**.

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/` | Sí | Listar atletas |
| `GET` | `/:id` | Sí | Atleta por ID |
| `GET` | `/:id/documentos` | Sí | Documentos del atleta |
| `POST` | `/` | Admin | Crear atleta |
| `POST` | `/:id/documentos` | Admin | Agregar documento |
| `PUT` | `/:id` | Admin | Actualizar atleta |
| `DELETE` | `/:id` | Admin | Eliminar atleta |
| `DELETE` | `/:id/documentos/:docId` | Admin | Eliminar documento |

**Query `GET /`:**

| Parámetro | Descripción |
|-----------|-------------|
| `search` | Buscar en nombre, apellidos o correo |
| `page`, `limit` | Paginación |

---

## Competiciones (`/competiciones`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/` | No | Listar competiciones |
| `GET` | `/:id` | No | Competición por ID |
| `POST` | `/` | Admin | Crear competición |
| `PUT` | `/:id` | Admin | Actualizar |
| `DELETE` | `/:id` | Admin | Eliminar |
| `POST` | `/inscribir-atleta` | Admin | Inscribir atleta en competición |

---

## Competiciones-Atletas (`/competiciones-atletas`)

Relación atleta–competición. **Sin autenticación** en el código actual.

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Listar inscripciones |
| `POST` | `/` | Crear relación |
| `PUT` | `/:id` | Actualizar |
| `DELETE` | `/:id` | Eliminar |

---

## Consultas (`/consultas`)

Formulario de contacto y gestión administrativa.

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/` | Admin | Listar consultas |
| `GET` | `/:id` | Admin | Consulta por ID |
| `POST` | `/` | No | Enviar consulta (público) |
| `PUT` | `/:id` | Admin | Actualizar |
| `DELETE` | `/:id` | Admin | Eliminar |
| `POST` | `/:id/sugerirRespuesta` | Admin | Borrador de respuesta con IA |
| `POST` | `/responder-masivo` | Admin | Respuesta masiva por correo |
| `POST` | `/:id/responder` | Admin | Responder y enviar correo |

---

## Disciplinas (`/disciplinas`)

Autenticación en todas. Escritura **Admin**.

| Método | Ruta |
|--------|------|
| `GET` | `/` |
| `GET` | `/:id` |
| `POST` | `/` |
| `PUT` | `/:id` |
| `DELETE` | `/:id` |

---

## Entrenadores (`/entrenadores`)

| Método | Ruta | Auth |
|--------|------|------|
| `GET` | `/` | Sí |
| `GET` | `/:id` | Sí |
| `POST` | `/` | Admin |
| `PUT` | `/:id` | Admin |
| `DELETE` | `/:id` | Admin |

---

## Inscripciones (`/inscripciones`)

Mismo patrón CRUD que disciplinas (auth + Admin en escritura).

| Método | Ruta |
|--------|------|
| `GET` | `/` |
| `GET` | `/:id` |
| `POST` | `/` |
| `PUT` | `/:id` |
| `DELETE` | `/:id` |

---

## Niveles de habilidad (`/niveles-habilidad`)

Mismo patrón CRUD (auth + Admin en escritura).

---

## Programas (`/programas`)

Mismo patrón CRUD (auth + Admin en escritura).

---

## Roles (`/roles`)

| Método | Ruta | Auth |
|--------|------|------|
| `GET` | `/` | Sí |
| `POST` | `/` | Admin |
| `PUT` | `/:id` | Admin |
| `DELETE` | `/:id` | Admin |

---

## Tutores (`/tutores`)

Mismo patrón CRUD (auth + Admin en escritura).

---

## Voluntarios (`/voluntarios`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/` | Sí | Listar |
| `GET` | `/:id` | Sí | Por ID |
| `POST` | `/` | Sí | Crear voluntario |
| `PUT` | `/:id/aprobar` | Sí | Aprobar |
| `PUT` | `/:id/rechazar` | Sí | Rechazar |
| `PUT` | `/:id` | Sí | Actualizar |
| `DELETE` | `/:id` | Sí | Eliminar |

---

## Áreas de voluntariado (`/voluntarios-areas`)

| Método | Ruta | Auth |
|--------|------|------|
| `GET` | `/` | No (público para formularios) |
| `POST` | `/` | Admin |
| `DELETE` | `/:id` | Admin |

---

## Estadísticas (`/stats`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/` | Sí | Estadísticas generales |
| `GET` | `/summary` | Sí | Alias de estadísticas |
| `GET` | `/charts` | Sí | Datos para gráficos |
| `GET` | `/public` | No | Stats para landing pública |

---

## Configuración (`/settings`)

| Método | Ruta | Auth |
|--------|------|------|
| `GET` | `/` | Sí |
| `PUT` | `/` | Admin |

---

## Registros pendientes (`/registros-pendientes`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/` | Admin | Listar pendientes (`search`, `page`, `limit`) |
| `POST` | `/` | No | Registro desde formulario público |
| `PATCH` | `/:id` | Admin | Aprobar / rechazar / actualizar estado |
| `DELETE` | `/:id` | Admin | Eliminar registro |

---

## Actividad del sistema (`/actividades-sistema`)

| Método | Ruta | Auth | Body (POST) |
|--------|------|------|-------------|
| `GET` | `/` | Sí | — |
| `POST` | `/` | Sí | `{ title, details, icon?, iconColor?, time? }` |

---

## Chat (`/chats`)

Chatbot del sitio (OpenAI). **Público.**

| Método | Ruta | Body |
|--------|------|------|
| `POST` | `/` | `{ "messages": [{ "role": "user", "content": "..." }] }` |

**Respuesta:** `{ "message": "..." }`

---

## Inteligencia artificial (`/ia`)

| Método | Ruta | Auth | Body / params |
|--------|------|------|---------------|
| `POST` | `/inclusion/chat` | No | `{ "prompt": "texto" }` |
| `GET` | `/salud/analizar/:atletaId` | No | ID del atleta en URL |
| `POST` | `/registro/ocr` | No | `{ "imagenBase64": "..." }` |
| `POST` | `/donacion/validar` | No | Comprobante (según implementación del controlador) |

> **Nota:** La ruta legacy `POST /api/certificados/analizar` existe en código (`certificadoRoutes.js`) pero **no está montada** en `app.js`. Usar `/api/v1/ia/registro/ocr`.

---

## Códigos de respuesta habituales

| Código | Significado |
|--------|-------------|
| `200` | OK |
| `201` | Creado |
| `400` | Validación / datos inválidos (incl. constraints CHECK) |
| `401` | Sin token o token inválido |
| `403` | Sin permisos (rol) |
| `404` | Recurso no encontrado |
| `500` | Error interno |

---

## Archivos relacionados

| Archivo | Uso |
|---------|-----|
| [openapi.yaml](./openapi.yaml) | Importar en Swagger UI / Postman |
| [Olimpiadas_Especiales_CostaRica.postman_collection.json](./Olimpiadas_Especiales_CostaRica.postman_collection.json) | Colección Postman actualizada |
| [Postman_Consultas.md](./Postman_Consultas.md) | Guía de importación y variables |
| `Backend/app.js` | Registro de rutas |

---

*Última actualización: mayo 2026 — prefijo `/api/v1`.*
