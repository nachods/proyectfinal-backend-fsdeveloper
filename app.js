require("dotenv").config();
const express = require("express"); // Importamos la librería para creación y manejo de rutas
const bodyParser = require("body-parser"); // Importamos la librería para analizar cuerpos de solicitud
const cors = require("cors"); // Importamos la librería para habilitar CORS
const apiVersion = process.env.API_VERSION; // Obtenemos la versión de la API desde las variables de entorno

const app = express(); // Creamos la aplicación a partir de la librería

// Configurar Header HTTP - CORS, permite las peticiones HTTP desde el cliente (npm i cors)
app.use(cors());

// Importar rutas, para definir cómo se van a manejar las solicitudes y datos
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const menuRoutes = require("./router/menu");
const pedidoRoutes = require("./router/pedido");

// Configurar Body Parse, nos permite procesar datos correctamente
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar static folder, la carpeta estática para subir las imágenes al servidor
app.use(express.static("uploads"));

// Configurar rutas
app.use(`/api/${apiVersion}`, authRoutes);
app.use(`/api/${apiVersion}`, userRoutes);
app.use(`/api/${apiVersion}`, menuRoutes);
app.use(`/api/${apiVersion}`, pedidoRoutes);

module.exports = app; // Exportar elementos
