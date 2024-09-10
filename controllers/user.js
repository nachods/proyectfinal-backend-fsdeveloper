//funcion que obtendra los datos del usuario
const User = require("../models/user");

async function getMe(req, res) {//get
  const { user_id } = req.user;

  const user = await User.findById(user_id); //se busca el usuario en la base de datos

  if (!user) {
    //sino es true devuelve error
    res.status(400).send({ msg: "No se ha encontrado usuario" });
  } else {
    res.status(200).send(user);
  }
}

async function getAllUsers(req, res) {//get
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await User.find();

    // Verificar si se encontraron usuarios
    if (!users || users.length === 0) {
      // Si no se encontraron usuarios, devolver un error 404
      return res.status(404).send({ msg: "No se encontraron usuarios" });
    }

    // Devolver los usuarios encontrados con un código de estado 200
    res.status(200).send(users);
  } catch (error) {
    // En caso de error, devolver un error 400 con el mensaje del error
    res
      .status(400)
      .send({ msg: `Error al enviar los usuarios: ${error.message}` });
  }
}

async function updateUser(req, res) {//patch
  try {
    // Extraer los parámetros del cuerpo de la solicitud
    const { firstname, lastname } = req.body;

    // Validar que se proporcionen todos los campos necesarios
    if (!firstname || !lastname) {
      return res.status(400).send({ msg: "Faltan parámetros requeridos" });
    }

    // Buscar el usuario por nombre y apellido
    const user = await User.findOne({ firstname, lastname });

    if (!user) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    // Alternar el estado del usuario entre `true` y `false`
    const updatedUser = await User.findOneAndUpdate(
      { firstname, lastname },
      { active: !user.active }, // Cambiar el estado al opuesto
      { new: true }
    );

    res.status(200).send({ msg: "Usuario actualizado con éxito", updatedUser });
  } catch (error) {
    res
      .status(400)
      .send({ msg: `Error al actualizar el usuario: ${error.message}` });
  }
}

async function deleteUser(req, res) {
  const { firstname, lastname } = req.params;

  try {
    // Buscar y eliminar el usuario que coincide con el firstname y lastname
    const user = await User.findOneAndDelete({ firstname, lastname });

    if (!user) {
      return res.status(404).send({ msg: "User no encontrado" });
    }

    res.status(200).send({ msg: "User eliminado con éxito" });
  } catch (error) {
    res.status(400).send({ msg: `Error al eliminar el User: ${error.message}` });
  }
}

module.exports = {
  getMe,
  getAllUsers,
  updateUser,
  deleteUser,
};
