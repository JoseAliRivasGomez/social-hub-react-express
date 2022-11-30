const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
    
    return new Promise( (resolve, reject) => {

        const payload = {uid};

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '30d'
        }, (error, token) => {
            if (error){
                console.log(error);
                reject('Couldnt generate token');
            }else{
                resolve(token);
            }
        })

    });

}

module.exports = {
    generarJWT
}