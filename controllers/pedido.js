const Pedido = require("../models/pedido"); // Modelo Pedido
const Menu = require("../models/menu"); // Modelo Menu
const User = require("../models/user"); // Modelo User
const mongoose = require("mongoose");

// Función para crear un nuevo pedido
async function createPedido(usuarioId, productos) {
  try {
    // Inicializar total
    let total = 0;

    // Procesar los productos
    const productosProcesados = await Promise.all(
      productos.map(async (producto) => {
        const menuItem = await Menu.findById(producto.menuItemId);
        if (!menuItem) {
          throw new Error(`Producto con ID ${producto.menuItemId} no encontrado`);
        }
        const cantidad = producto.cantidad || 1;
        const precioProducto = parseFloat(menuItem.precio);
        total += cantidad * precioProducto; // Multiplicar cantidad por el precio del producto
        return {
          menuItemId: producto.menuItemId,
          cantidad,
          precio: precioProducto, // Guardar el precio por unidad del producto
        };
      })
    );

    // Crear el pedido
    const pedido = new Pedido({
      usuarioId: usuarioId,
      productos: productosProcesados, // los id y las cantidades
      total, // precio total calculado
      estado: "Pago Pendiente", // Estado inicial del pedido
    });

    // Guardar el pedido en la base de datos
    await pedido.save();
    return { success: true, pedido };
  } catch (error) {
    throw new Error(`Error al crear el pedido: ${error.message}`);
  }
}

// Función para actualizar un pedido existente
async function updatePedido(pedido, productos) {
  try {
    // Actualizar productos en el pedido
    for (const producto of productos) {
      const index = pedido.productos.findIndex(
        (p) => p.menuItemId.toString() === producto.menuItemId
      );

      if (index !== -1) {
        // Si el producto ya existe, actualizar su cantidad
        pedido.productos[index].cantidad += producto.cantidad || 1;
      } else {
        // Si el producto no existe en el pedido, agregarlo
        pedido.productos.push({
          menuItemId: producto.menuItemId,
          cantidad: producto.cantidad || 1,
          precio: 0, // El precio será actualizado en el cálculo final
        });
      }
    }

    // Recalcular el total
    const total = await calcularTotal(pedido.productos);
    pedido.total = total;
    await pedido.save();
    return { success: true, pedido };
  } catch (error) {
    throw new Error(`Error al actualizar el pedido: ${error.message}`);
  }
}

// Función para calcular el total del pedido
async function calcularTotal(productos) {
  let total = 0;

  for (const prod of productos) {
    const menuItem = await Menu.findById(prod.menuItemId);
    if (menuItem) {
      const precioProducto = parseFloat(menuItem.precio);
      total += prod.cantidad * precioProducto; // Multiplicar cantidad por el precio del producto
    }
  }

  return total;
}

async function createOrUpdatePedido(req, res) {
  const { usuarioId, productos } = req.body;

  // Verificar que todos los datos requeridos estén presentes
  if (!usuarioId || !productos || productos.length === 0) {
    return res.status(400).send({ msg: "Datos insuficientes para crear o actualizar el pedido" });
  }

  try {
    // Validar si el ID del usuario es válido
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).send({ msg: "ID de usuario inválido" });
    }

    // Verificar si el usuario existe
    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    // Buscar un pedido pendiente existente para el usuario
    let pedido = await Pedido.findOne({
      usuarioId: usuario._id,
      estado: "Pago Pendiente",
    });

    if (pedido) {
      // Si existe un pedido pendiente, actualizarlo
      const resultado = await updatePedido(pedido, productos);
      return res.status(200).send({ msg: "Pedido actualizado con éxito", pedido: resultado.pedido });
    } else {
      // Si no existe un pedido pendiente, crear uno nuevo
      const resultado = await createPedido(usuario._id, productos);
      return res.status(200).send({ msg: "Pedido creado y guardado con éxito", pedido: resultado.pedido });
    }
  } catch (error) {
    return res.status(500).send({ msg: `Error al crear o actualizar el pedido: ${error.message}` });
  }
}

// Función para obtener el pedido de un usuario específico
async function getMePedido(req, res) {
  const { usuarioId } = req.params; // Obtener el usuarioId de los parámetros de la URL

  try {
    // Validar si el ID del usuario es válido
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).send({ msg: "ID de usuario inválido" });
    }

    // Buscar el pedido del usuario
    const pedido = await Pedido.findOne({ usuarioId });

    if (!pedido) {
      return res.status(404).send({ msg: 'Pedido no encontrado' });
    }

    // Buscar los detalles del usuario
    const usuario = await User.findById(usuarioId);

    if (!usuario) {
      return res.status(404).send({ msg: 'Usuario no encontrado' });
    }

    // Buscar los detalles de cada producto
    const productosDetalles = await Promise.all(
      pedido.productos.map(async (producto) => {
        const menuItem = await Menu.findById(producto.menuItemId);
        return {
          menuItemId: producto.menuItemId,
          cantidad: producto.cantidad,
          precio: menuItem ? menuItem.precio : 0,
          nombre: menuItem ? menuItem.nombre : 'Nombre no disponible',
        };
      })
    );

    // Enviar el pedido con los detalles de los productos y el usuario
    res.status(200).send({
      pedido: {
        ...pedido.toObject(),
        productos: productosDetalles,
        usuarioNombre: usuario.firstname + ' ' + usuario.lastname, // Agrega el nombre del usuario
      },
    });
  } catch (error) {
    return res.status(500).send({ msg: `Error al obtener el pedido: ${error.message}` });
  }
}

// Función para obtener todos los pedidos con detalles de productos y usuarios
async function getAllPedidos(req, res) {
  try {
    // Obtener todos los pedidos
    const pedidos = await Pedido.find();

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).send({ msg: "No se encontraron pedidos" });
    }

    // Obtener detalles de cada pedido
    const pedidosDetalles = await Promise.all(
      pedidos.map(async (pedido) => {
        // Buscar detalles del usuario
        const usuario = await User.findById(pedido.usuarioId);
        if (!usuario) {
          throw new Error(`Usuario con ID ${pedido.usuarioId} no encontrado`);
        }

        // Buscar detalles de los productos
        const productosDetalles = await Promise.all(
          pedido.productos.map(async (producto) => {
            const menuItem = await Menu.findById(producto.menuItemId);
            return {
              menuItemId: producto.menuItemId,
              cantidad: producto.cantidad,
              precio: menuItem ? menuItem.precio : 0,
              nombre: menuItem ? menuItem.nombre : "Nombre no disponible",
            };
          })
        );

        return {
          ...pedido.toObject(),
          productos: productosDetalles,
          usuarioNombre: `${usuario.firstname} ${usuario.lastname}`,
        };
      })
    );

    // Enviar la lista de pedidos con los detalles de los productos y el usuario
    res.status(200).send(pedidosDetalles);
  } catch (error) {
    res.status(400).send({ msg: `Error al enviar los pedidos: ${error.message}` });
  }
}

/// Funcion que elimina un pedido
async function deletePedido(req, res) {
  const { usuarioId } = req.params;

  try {
    const pedido = await Pedido.findOneAndDelete({ usuarioId });

    if (!pedido) {
      return res.status(404).send({ msg: "Pedido no encontrado" });
    }

    res.status(200).send({ msg: "Pedido eliminado con éxito" });
  } catch (error) {
    res.status(400).send({ msg: `Error al eliminar el pedido: ${error.message}` });
  }
}

// Función que SOLO actualiza el estado del pedido
async function updateStatusPedido(req, res) {
  const { pedidoId, nuevoEstado } = req.body;

  // Verificar que todos los datos requeridos estén presentes
  if (!pedidoId || !nuevoEstado) {
    return res.status(400).send({ msg: "Datos insuficientes para actualizar el estado del pedido" });
  }

  // Verificar que el nuevo estado sea uno de los valores permitidos
  const estadosPermitidos = ["Pago Pendiente", "En proceso", "Completado", "Cancelado"];
  if (!estadosPermitidos.includes(nuevoEstado)) {
    return res.status(400).send({ msg: "Estado no válido" });
  }

  try {
    // Validar si el ID del pedido es válido
    if (!mongoose.Types.ObjectId.isValid(pedidoId)) {
      return res.status(400).send({ msg: "ID de pedido inválido" });
    }

    // Buscar el pedido
    const pedido = await Pedido.findById(pedidoId);

    if (!pedido) {
      return res.status(404).send({ msg: "Pedido no encontrado" });
    }

    // Actualizar el estado del pedido
    pedido.estado = nuevoEstado;
    await pedido.save();

    res.status(200).send({ msg: "Estado del pedido actualizado con éxito", pedido });
  } catch (error) {
    res.status(500).send({ msg: `Error al actualizar el estado del pedido: ${error.message}` });
  }
}

module.exports = {
  createOrUpdatePedido,
  getMePedido,
  getAllPedidos,
  deletePedido,
  updateStatusPedido,
};
