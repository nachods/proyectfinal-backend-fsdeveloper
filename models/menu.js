const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  detalle: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  image: {type: String, required: true },
  estado: { type: Boolean, required: true }, // activo o inactivo
});

module.exports = mongoose.model("Menu", MenuSchema);
