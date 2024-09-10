const mongoose = require("mongoose"); // Asegúrate de usar "mongoose"

const PedidoSchema = mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Aquí se indica que "usuarioId" hace referencia al modelo "User"
    required: true,
  },
  productos: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu", // Referencia al modelo Menu
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  total: {
    type: Number, // Precio total del pedido
    required: true,
  },
  estado: {
    type: String,
    enum: ["Pago Pendiente", "En proceso", "Completado", "Cancelado"], // Opciones del estado del pedido
    default: "Pago Pendiente",
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pedido", PedidoSchema);
