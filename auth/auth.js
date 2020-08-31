const jwt = require('jsonwebtoken');
require('dotenv').config();


function createJwt(payload){
    return jwt.sign({user: payload}, process.env.SECRET, {expiresIn: 3600} )
}

function verifyJwt(token){
    return jwt.verify(token, process.env.SECRET);
}

module.exports ={
    createJwt,
    verifyJwt
}