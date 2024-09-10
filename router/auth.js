const express = require('express'); // Importamos una libreia
const AuthController = require('../controllers/auth'); // Importamos el controlador

const api = express.Router(); // Creacion del enrutador con express

api.post('/auth/register', AuthController.register);
api.post('/auth/login', AuthController.login);

module.exports = api;

// Metodo POST para obtener la info que llega creando un nuevo recurso, cuando nos llega un formulario con un nuevo registro
