const express = require("express");
const UserController = require("../controllers/user"); // Importamos el controlador
const md_auth = require("../middlewares/authenticated");

const api = express.Router(); // Creación del enrutador con express

// Usa la función getMe en lugar de register
api.get("/user/me", [md_auth.asureAuth], UserController.getMe);
api.get("/user/all", UserController.getAllUsers);
api.patch("/user/all", UserController.updateUser);
api.delete('/user/delete/:firstname/:lastname', UserController.deleteUser);

module.exports = api;
