const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat - Procesar mensaje con IA
router.post('/', chatController.processChat);

module.exports = router;
