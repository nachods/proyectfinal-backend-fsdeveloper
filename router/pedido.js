const express = require("express");
const PedidoController = require("../controllers/pedido"); // Importamos el controlador

const api = express.Router();

//Rutas
api.post('/pedidos/crear', PedidoController.createOrUpdatePedido);
api.get('/pedidos/crear/:usuarioId', PedidoController.getMePedido);
api.get('/pedidos/all', PedidoController.getAllPedidos);
api.delete('/pedidos/delete/:usuarioId', PedidoController.deletePedido);
api.patch('/pedidos/status', PedidoController.updateStatusPedido);

module.exports = api;