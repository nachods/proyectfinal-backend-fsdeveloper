//modelo donde se representara la estructura de los datos del sitio, y como se almacenaran
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true },
  active: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", UserSchema);
