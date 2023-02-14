const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function comparePassword(pp,hp){
    return bcrypt.compareSync(pp, hp);
}

function generateJWT(data){
    return jwt.sign({ tokendata : data }, process.env.PRIVATE_KEY_JWT);
}


module.exports = { 
    comparePassword,
    generateJWT
}
