const express = require("express");
const MenuController = require("../controllers/menu"); // Importamos el controlador

const api = express.Router();

const multiparty = require('connect-multiparty');
const md_upload = multiparty({ uploadDir: './uploads' }); // Aquí se suben los archivos directamente a uploads

// Rutas de menús
api.post('/menu', [md_upload], MenuController.createMenu);
api.get('/menu', MenuController.getMenu);
api.patch('/menu/:nombre', [md_upload], MenuController.updateMenu); //Actualizaciones parciales y no totales
api.delete('/menu/:nombre', MenuController.deleteMenu);

module.exports = api;
