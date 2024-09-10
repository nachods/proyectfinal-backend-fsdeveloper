// los middlewares son intermediarios entre el cliente y el server, verifican los ingresos de datos a ver si son correctos
const jwt = require("../utils/jwt");

function asureAuth(req, res, next) {
  // Bearer es un método de autenticación para enviar tokens
  if (!req.headers.authorization) {
    // If por si no llega token
    return res.status(403).send({ msg: "La petición no tiene cabecera de autorización" });
  }

  const token = req.headers.authorization.replace("Bearer ", ""); // Eliminamos el Bearer anterior utilizado

  try {
    const payload = jwt.decode(token); // Decodificamos el token
    const { exp } = payload; // Obtenemos la fecha de expiración del token
    const currentDate = new Date().getTime();

    if (exp <= currentDate) {
      // Comparamos la hora del token con la actual, y si la actual es superior a la expirada, es que expiró
      return res.status(400).send({ msg: "El token ha expirado" });
    }

    req.user = payload; // Asignamos los datos del usuario decodificados a la solicitud
    next(); // Pasamos al siguiente middleware o ruta en la cadena de manejo

  } catch (error) {
    return res.status(400).send({ msg: "Token inválido" });
  }
}

module.exports = {
  asureAuth,
};
