-- ============================================================
-- SCRIPT SQL DE MIGRACIÓN: db.json → MySQL
-- Olimpiadas Especiales Costa Rica
-- ============================================================
-- Ejecutar en MySQL Workbench o phpMyAdmin después de crear
-- las tablas con: npx sequelize-cli db:migrate
-- ============================================================

USE olimpiadas_db;

-- [verde] Desactivar revisión de claves foráneas para una inserción limpia
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TABLA: atletas
-- [verde] 6 atletas extraídos del db.json
-- ============================================================
INSERT INTO atletas (nombre, primer_apellido, segundo_apellido, fecha_nacimiento, genero, telefono, correo_electronico, fecha_registro) VALUES
('carlosfwd',     '',           NULL,      '2018-02-23', 'Masculino', '123456789',    'carlos@gmail.com',         '2026-03-24 20:00:29'),
('franshsko',     'porras',     NULL,      '2000-01-01', 'Masculino', '3535364364',   'nporrasafwd@gmail.com',    '2026-03-29 01:48:11'),
('salomon',       'porras',     NULL,      '2000-01-01', 'Masculino', '12345678910',  'nporrasafwd@gmail.com',    '2026-03-29 19:10:39'),
('Gerson David',  'Dinarte',    'Fuentes', '2006-01-01', 'Masculino', '89074567',     'gfuentesfwd@gmail.com',    '2026-03-30 17:10:51'),
('keysha',        '',           NULL,      '2026-07-19', 'Femenino',  '89074567',     'key@gmail.com',            '2026-03-30 17:43:33'),
('Mauricio',      'Perez',      'Solis',   '2007-02-12', 'Masculino', '63511090',     'camaron@gmail.com',        '2026-03-30 20:02:50');

-- ============================================================
-- TABLA: atleta_condiciones
-- [verde] Condiciones médicas de cada atleta
-- Nota: Los IDs del INSERT anterior se asignan automáticamente.
-- Ajusta los atleta_id si ya tenías datos en la tabla.
-- ============================================================

-- Atleta 1 (carlosfwd) → ID 1
INSERT INTO atleta_condiciones (atleta_id, condicion) VALUES
(1, 'Síndrome De Marfan');

-- Atleta 5 (keysha) → ID 5
INSERT INTO atleta_condiciones (atleta_id, condicion) VALUES
(5, 'Parálisis Cerebral');

-- Atleta 6 (Mauricio Perez Solis) → ID 6
INSERT INTO atleta_condiciones (atleta_id, condicion) VALUES
(6, 'Síndrome de Down');

-- ============================================================
-- TABLA: atleta_dispositivos
-- [verde] Dispositivos y ayudas de cada atleta
-- ============================================================

-- Atleta 1 (carlosfwd)
INSERT INTO atleta_dispositivos (atleta_id, tipo, nombre) VALUES
(1, 'movilidad',   'Caminador'),
(1, 'vida',        'Gafas/lentes de contacto'),
(1, 'medico',      'Desfibrilador cardioversor implantable');

-- Atleta 5 (keysha)
INSERT INTO atleta_dispositivos (atleta_id, tipo, nombre) VALUES
(5, 'movilidad',     'Caminador'),
(5, 'vida',          'Dentadura postiza'),
(5, 'comunicacion',  'Audífono');

-- Atleta 6 (Mauricio)
INSERT INTO atleta_dispositivos (atleta_id, tipo, nombre) VALUES
(6, 'movilidad',     'Caminador'),
(6, 'comunicacion',  'Dispositivos de comunicación');

-- ============================================================
-- TABLA: atleta_medicamentos
-- [verde] Medicamentos del atleta Mauricio Perez Solis (ID: 6)
-- ============================================================
INSERT INTO atleta_medicamentos (atleta_id, nombre, dosis, frecuencia) VALUES
(6, 'zabutaml', '2 gramos', '2 veces a la semana');

-- ============================================================
-- No hay alergias registradas en el db.json para los atletas
-- ============================================================

-- [verde] Reactivar revisión de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- VERIFICACIÓN FINAL
-- [verde] Ejecuta estas queries para confirmar que todo se
-- insertó correctamente.
-- ============================================================
SELECT 'ATLETAS TOTALES:' AS tabla, COUNT(*) AS total FROM atletas
UNION ALL
SELECT 'CONDICIONES:', COUNT(*) FROM atleta_condiciones
UNION ALL
SELECT 'DISPOSITIVOS:', COUNT(*) FROM atleta_dispositivos
UNION ALL
SELECT 'MEDICAMENTOS:', COUNT(*) FROM atleta_medicamentos
UNION ALL
SELECT 'ALERGIAS:', COUNT(*) FROM atleta_alergias;

-- ============================================================
-- RESULTADOS ESPERADOS:
--   ATLETAS TOTALES   → 6
--   CONDICIONES       → 3
--   DISPOSITIVOS      → 8
--   MEDICAMENTOS      → 1
--   ALERGIAS          → 0
-- ============================================================
