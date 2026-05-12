const fs = require('fs');
const path = require('path');

const models = [
  { name: 'Tutor', route: 'tutores' },
  { name: 'Disciplina', route: 'disciplinas' },
  { name: 'Programa', route: 'programas' },
  { name: 'NivelHabilidad', route: 'nivelesHabilidad' },
  { name: 'Inscripcion', route: 'inscripciones' },
  { name: 'Consulta', route: 'consultas' }
];

models.forEach(m => {
  const controllerName = `${m.name.charAt(0).toLowerCase() + m.name.slice(1)}Controller`;
  
  // Controller
  const controllerCode = `const { models } = require('../config/database');
const { ${m.name} } = models;

exports.getAll = async (req, res, next) => {
  try {
    const data = await ${m.name}.findAll();
    res.json(data);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await ${m.name}.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: '${m.name} no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await ${m.name}.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await ${m.name}.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: '${m.name} no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await ${m.name}.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: '${m.name} no encontrado' });
    await data.destroy();
    res.json({ message: '${m.name} eliminado' });
  } catch (error) { next(error); }
};
`;
  fs.writeFileSync(path.join(__dirname, 'controllers', `${controllerName}.js`), controllerCode);

  // Route
  const routeCode = `const express = require('express');
const router = express.Router();
const ${controllerName} = require('../controllers/${controllerName}');

router.get('/', ${controllerName}.getAll);
router.get('/:id', ${controllerName}.getById);
router.post('/', ${controllerName}.create);
router.put('/:id', ${controllerName}.update);
router.delete('/:id', ${controllerName}.delete);

module.exports = router;
`;
  fs.writeFileSync(path.join(__dirname, 'routes', `${m.route}.routes.js`), routeCode);
});

console.log('CRUD files generated.');
