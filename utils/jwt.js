//token para iniciar sesion en la web
const jwt = require('jsonwebtoken');
require('dotenv').config(); //Cargar variables
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; //me traigo variable de .env

function createAccessToken(user) {
    const expToken = new Date(); //Hora actual para la expiracion del token
    expToken.setHours(expToken.getHours() + 3); //Dura 3h el token

    const payload = {
        token_type: 'access', //tipo acceder
        user_id: user._id, //Id del usuario
        iat: Date.now(), //Hora actual del usuario
        exp: expToken.getTime(), //Calcula hora de expiracion del token
    }

    return jwt.sign(payload, JWT_SECRET_KEY);
};

function decode (token) { //retorno datos mediante token
    return jwt.decode(token, JWT_SECRET_KEY, true);
};

module.exports = {
    createAccessToken,
    decode,
};