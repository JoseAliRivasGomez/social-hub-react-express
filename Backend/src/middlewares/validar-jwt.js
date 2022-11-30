const {response} = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../models/db');

const validarJWT = async (req, res = response, next) => {

    //const token = req.header('x-token');
    const token = req.cookies.token;
    //console.log(token);

    if (!token) {
        return res.status(401).json({
            msg: 'There is no token in the request'
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRET_JWT_SEED);

        const userJWT = await User.findByPk(uid);

        if (!userJWT || !userJWT.state){
            return res.status(401).json({
                msg: 'Invalid token'
            });
        }

        req.userJWT = userJWT;

        next();
        
    } catch (error) {
        return res.status(401).json({
            msg: 'Invalid token'
        })
    }
    
}

module.exports = {
    validarJWT
}