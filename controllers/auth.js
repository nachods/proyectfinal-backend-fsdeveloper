const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");

// req es un objeto que contiene info sobre la solicitud del cliente
// res es un objeto que tiene el server para enviar una respuesta (200,400,500,etc)
async function register(req, res) {
  // Maneja solicitudes de registro
  const { firstname, lastname, phone, email, password } = req.body; // Forma de acceder a los datos que recibimos

  if (!email) return res.status(400).send({ msg: "El Email es obligatorio" }); // De esta forma hacemos que el email y la contraseña sean obligatorios
  if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });
  if (!phone) return res.status(400).send({ msg: "El teléfono es obligatorio" });

  const user = new User({
    firstname,
    lastname,
    phone,
    email: email.toLowerCase(),
    password, // Encriptar contraseña con bcryptjs
    active: false,
    admin: false,
  });

  const salt = bcrypt.genSaltSync(10); // Genera una sal de 10 (Cosas aleatorias)
  const hashPassword = bcrypt.hashSync(password, salt); // Crea la contraseña encriptada, una mezcla de la sal y la contraseña hecha por el usuario
  user.password = hashPassword; // El usuario toma la nueva contraseña encriptada como suya

  try {
    await user.save();

    res.status(201).send({ msg: "Usuario guardado correctamente, esperar activación" });
  } catch (error) {
    res.status(400).send({ msg: `Error al crear el usuario: ${error.message}` }); // Incluye error.message para mayor claridad
  }
}

async function login(req, res) {
  // Maneja solicitudes de login
  const { email, password } = req.body; // Forma de acceder a los datos que recibimos

  if (!email) return res.status(400).send({ msg: "El Email es obligatorio" }); // Asegura que el email y la contraseña sean obligatorios
  if (!password) return res.status(400).send({ msg: "La contraseña es obligatoria" });

  try {
    // Busca el correo solicitado (en minúsculas)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Si no encontramos al usuario, retornamos un error 404
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    // Comparamos las contraseñas
    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      // Si la contraseña no es correcta
      return res.status(400).send({ msg: "Contraseña Incorrecta" });
    } else if (!user.active) {
      // Comprobamos si el usuario está activo
      return res.status(401).send({ msg: "Usuario no autorizado o activo. Esperar activación" });
    } else {
      // En caso de que no haya errores, todo ok y continúa con generación de token
      return res.status(200).send({ access: jwt.createAccessToken(user) });
    }
  } catch (error) {
    // Captura y responde en caso de error en el servidor
    return res.status(500).send({ msg: "Error en el servidor", error: error.message }); // Incluye error.message para mayor claridad
  }
}

module.exports = {
  register,
  login,
};
