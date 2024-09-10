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
    //Aca indico donde se va a conectar, la direccion con los datos
    await mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@${dbHost}`);
    app.listen(port, () => {
      //Inicia el server con 'npm run dev'
      console.log("================================");
      console.log("============API RESET===========");
      console.log("================================");
      console.log(`http://${ipServer}:${port}/api/${apiVersion}`);
    });
    console.log("La conexion con base de datos fue exitosa");
  } catch (error) {
    console.log("Error al conectar la base de datos", error);
  }
};

connectDB();

//npm i nodemon nos ayuda a actualizar el app de forma automatica, y no teniendo que reiniciar el server
