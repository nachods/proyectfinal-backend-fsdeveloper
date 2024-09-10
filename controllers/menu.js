const Menu = require("../models/menu");
const image = require("../utils/image");
const fs = require('fs');
const path = require('path');

async function createMenu(req, res) { //post
  const { nombre, detalle, categoria, precio } = req.body;

  if (!nombre || !detalle || !categoria || !precio) {
    res.status(400).send({ msg: "Datos insuficientes" });
    return;
  }

  let imagePath = null;
  if (req.files && req.files.image) {
    imagePath = image.getFileName(req.files.image);
  }

  const menu = new Menu({
    nombre,
    detalle,
    categoria,
    precio,
    image: imagePath,
    estado: false,
  });

  try {
    await menu.save();
    res.status(200).send({ msg: "Menú creado y guardado con éxito" });
  } catch (error) {
    res.status(400).send({ msg: `Error al crear el menú: ${error.message}` });
  }
}

async function updateMenu(req, res) { //patch
  const { nombre } = req.params; // Nombre actual del menú
  const { detalle, categoria, precio, estado, nuevoNombre } = req.body; // nuevoNombre es el nombre que queremos actualizar

  try {
    // Encuentra el menú por su nombre actual
    const menu = await Menu.findOne({ nombre });

    if (!menu) {
      return res.status(404).send({ msg: "Menú no encontrado" });
    }

    let imagePath = menu.image; // Mantén la imagen existente por defecto

    // Verifica si hay una nueva imagen en la solicitud
    if (req.files && req.files.image) {
      imagePath = image.getFileName(req.files.image);

      // Si se subió una nueva imagen, elimina la anterior
      if (menu.image) {
        const oldImagePath = path.join(__dirname, "../uploads", menu.image);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // Actualiza los campos con los nuevos valores, incluido el nombre
    menu.nombre = nuevoNombre || menu.nombre; // Actualiza el nombre si se proporciona uno nuevo
    menu.detalle = detalle || menu.detalle;
    menu.categoria = categoria || menu.categoria;
    menu.precio = precio || menu.precio;
    menu.estado = estado !== undefined ? estado : menu.estado;
    menu.image = imagePath;

    // Guarda el menú actualizado
    await menu.save();

    res.status(200).send({ msg: "Menú actualizado con éxito", menu });
  } catch (error) {
    res.status(400).send({ msg: `Error al actualizar el menú: ${error.message}` });
  }
}

async function deleteMenu(req, res) { //delete
  const { nombre } = req.params;

  try {
    const menu = await Menu.findOneAndDelete({ nombre });

    if (!menu) {
      return res.status(404).send({ msg: "Menú no encontrado" });
    }

    if (menu.image) {
      const imagePath = path.join(__dirname, "../uploads", menu.image);
      console.log('Image Path:', imagePath);

      if (fs.existsSync(imagePath)) {
        console.log('File exists, proceeding to delete...');
        fs.unlinkSync(imagePath);
        console.log('File deleted successfully');
      } else {
        console.log('File does not exist:', imagePath);
      }
    }

    res.status(200).send({ msg: "Menú eliminado con éxito" });
  } catch (error) {
    res.status(400).send({ msg: `Error al eliminar el menú: ${error.message}` });
  }
}

async function getMenu(req, res) { //get
  try {
    const menus = await Menu.find();

    if (!menus || menus.length === 0) {
      return res.status(404).send({ msg: "No se encontraron menús" });
    }
    res.status(200).send(menus);
  } catch (error) {
    res.status(400).send({ msg: `Error al enviar los menús: ${error.message}` });
  }
}

module.exports = {
  createMenu,
  updateMenu,
  deleteMenu,
  getMenu,
};
