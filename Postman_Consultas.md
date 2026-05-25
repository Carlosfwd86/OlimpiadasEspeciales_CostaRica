# Colección Postman y documentación de la API

Guía para probar la API de **Olimpiadas Especiales Costa Rica**.

## Archivos disponibles

| Archivo | Descripción |
|---------|-------------|
| [API_ENDPOINTS.md](./API_ENDPOINTS.md) | **Documentación completa** de todos los endpoints (español) |
| [openapi.yaml](./openapi.yaml) | Especificación OpenAPI 3 — importar en **Swagger UI**, Postman o Insomnia |
| [Olimpiadas_Especiales_CostaRica.postman_collection.json](./Olimpiadas_Especiales_CostaRica.postman_collection.json) | Colección Postman lista para importar |

---

## Importar en Postman

1. Abre **Postman** → **Import**.
2. Arrastra `Olimpiadas_Especiales_CostaRica.postman_collection.json`.
3. En la colección, pestaña **Variables**:
   - `base_url` = `http://localhost:3000`
   - `token` = (se llena solo al hacer login)

> Todas las rutas usan el prefijo **`/api/v1`**.

---

## Importar en Swagger UI

1. Entra a [Swagger Editor](https://editor.swagger.io/) o levanta Swagger UI localmente.
2. **File → Import** → selecciona `openapi.yaml`.
3. El servidor por defecto es `http://localhost:3000/api/v1`.

---

## Autenticación

1. Ejecuta **Iniciar sesión** (`POST /api/v1/auth/login`).
2. El script de la petición guarda el JWT en `{{token}}`.
3. Las peticiones protegidas usan **Bearer Token** con esa variable.

También puedes usar la cookie `token` que devuelve el login en el navegador.

---

## Regenerar la colección Postman

Si se agregan rutas nuevas en el backend:

```bash
node Backend/scripts/generate-postman-collection.js
```

Esto actualiza `Olimpiadas_Especiales_CostaRica.postman_collection.json` en la raíz del repo.

---

## Requisitos

- Backend en ejecución: `npm run dev` (puerto **3000** por defecto).
- Base de datos MySQL configurada en `Backend/.env`.

---

*Equipo Olimpiadas Especiales Costa Rica*
