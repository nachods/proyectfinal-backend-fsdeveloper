const mongoose = require("mongoose"); //Funciona como importar el require
const app = require("./app"); //Importamos la libreria
require("dotenv").config(); //Importamos la libreria

const dbUser = process.env.DB_USER; //Me traigo las variables desde .env
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const ipServer = process.env.IP_SERVER;
const apiVersion = process.env.API_VERSION;
const port = process.env.PORT;

const connectDB = async () => {
  //Aca conecto la base de datos
  try {
    // Conexión a MongoDB con parámetros adicionales
    await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/miBaseDeDatos?retryWrites=true&w=majority`, // Cambia "miBaseDeDatos" por el nombre real de tu base
      {
        useNewUrlParser: true, // Estas opciones ayudan a prevenir problemas de conexión
        useUnifiedTopology: true,
      }
    );
    app.listen(port, () => {
      //Inicia el server con 'npm run dev'
      console.log("================================");
      console.log("============API RESET===========");
      console.log("================================");
      console.log(`http://${ipServer}:${port}/api/${apiVersion}`);
    });
    console.log("La conexión con base de datos fue exitosa");
  } catch (error) {
    console.log("Error al conectar la base de datos", error);
  }
};

connectDB();
