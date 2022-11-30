const {request, response} = require('express');
const {Channels_Users, Channel, User} = require('../models/db');
const jwt = require('jsonwebtoken');

const getConnections = async (req = request, res = response) => {

    try {

        const {userJWT} = req;

        const connections = await Channels_Users.findAll({
            where: {
                UserId: userJWT.id,
                state: true
            },
        });

        res.json({
            connections
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

const createConnection = async (req = request, res = response) => {

    try {

        const {userJWT, body} = req;

        const c = await Channels_Users.findOne({
            where: {
                UserId: userJWT.id,
                ChannelId: body.ChannelId,
                state: true
            }
        });

        if(c){
            return res.status(404).json({
                msg: `There is already a connection to this channel`
            });
        }

        const c2 = await Channels_Users.findOne({
            where: {
                UserId: userJWT.id,
                ChannelId: body.ChannelId,
                state: false
            }
        });

        if(c2){ //si ya existe pero esta desactivado

            await c2.update({state: true});

            res.json({
                connection: c2
            });

        }else{
            const data = {
                ...body,
                UserId: userJWT.id
            }
    
            const connection = Channels_Users.build(data);
            await connection.save();
    
            res.json({
                connection
            });
        }

        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }
}

const createTwitterConnection = async (req = request, res = response) => {

    try {

        const cookies = req.headers.cookie;

        const cookiesArray = cookies.split('; ');
        let token;
        cookiesArray.forEach(cookie => {
            if(cookie.substring(0,5) === 'token'){
                const segments = cookie.split('=');
                token = segments[segments.length-1];
                return;
            }
        });

        if (!token) {
            return res.status(401).json({
                msg: 'There is no token in the request'
            })
        }

        const {uid} = jwt.verify(token, process.env.SECRET_JWT_SEED);

        const userJWT = await User.findByPk(uid);

        if (!userJWT || !userJWT.state){
            return res.status(401).json({
                msg: 'Invalid token'
            });
        }

        const channel = await Channel.findOne({
            where: {
                name: 'Twitter',
                state: true
            }
        });
        
        const {mediaId, accessToken, username, photo, tokenSecret} = req.federatedUser;

        const c = await Channels_Users.findOne({
            where: {
                UserId: userJWT.id,
                ChannelId: channel.id,
                state: true
            }
        });

        if(c){
            // return res.status(404).json({
            //     msg: `There is already a connection to this channel`
            // });
            await c.update({
                mediaId, accessToken, username, photoURL: photo, tokenSecret,
            });
            return res.redirect('http://localhost:3000/channels');
        }

        const c2 = await Channels_Users.findOne({
            where: {
                UserId: userJWT.id,
                ChannelId: channel.id,
                state: false
            }
        });

        if(c2){ //si ya existe pero esta desactivado

            await c2.update({
                mediaId, accessToken, username, photoURL: photo, tokenSecret,
                state: true
            });

            // res.json({
            //     connection: c2
            // });

        }else{
            const data = {
                mediaId, accessToken, username, photoURL: photo, tokenSecret,
                ChannelId: channel.id,
                UserId: userJWT.id
            }
    
            const connection = Channels_Users.build(data);
            await connection.save();
    
            // res.json({
            //     connection
            // });
        }


        req.session = null;
        req.user = null;
        //console.log(req);
        res.redirect('http://localhost:3000/channels');
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }
}

const createLinkedInConnection = async (req = request, res = response) => {

    try {

        
        const cookies = req.headers.cookie;

        const cookiesArray = cookies.split('; ');
        let token;
        cookiesArray.forEach(cookie => {
            if(cookie.substring(0,5) === 'token'){
                const segments = cookie.split('=');
                token = segments[segments.length-1];
                return;
            }
        });

        if (!token) {
            return res.status(401).json({
                msg: 'There is no token in the request'
            })
        }

        const {uid} = jwt.verify(token, process.env.SECRET_JWT_SEED);

        const userJWT = await User.findByPk(uid);

        if (!userJWT || !userJWT.state){
            return res.status(401).json({
                msg: 'Invalid token'
            });
        }

        const channel = await Channel.findOne({
            where: {
                name: 'LinkedIn',
                state: true
            }
        });
        
        const {mediaId, accessToken, username, photo} = req.federatedUser;

        const c = await Channels_Users.findOne({
            where: {
                UserId: userJWT.id,
                ChannelId: channel.id,
                state: true
            }
        });

        if(c){
            // return res.status(404).json({
            //     msg: `There is already a connection to this channel`
            // });
            await c.update({
                mediaId, accessToken, username, photoURL: photo,
            });
            return res.redirect('http://localhost:3000/channels');
        }

        const c2 = await Channels_Users.findOne({
            where: {
                UserId: userJWT.id,
                ChannelId: channel.id,
                state: false
            }
        });

        if(c2){ //si ya existe pero esta desactivado

            await c2.update({
                mediaId, accessToken, username, photoURL: photo,
                state: true
            });

            // res.json({
            //     connection: c2
            // });

        }else{
            const data = {
                mediaId, accessToken, username, photoURL: photo,
                ChannelId: channel.id,
                UserId: userJWT.id
            }
    
            const connection = Channels_Users.build(data);
            await connection.save();
    
            // res.json({
            //     connection
            // });
        }


        req.session = null;
        req.user = null;
        //console.log(req);
        res.redirect('http://localhost:3000/channels');
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }
}

const deleteConnection = async (req = request, res = response) => { //By Channel ID

    try {

        const {userJWT} = req;

        const {id} = req.params;

        const connection = await Channels_Users.findOne({
            where: {
                ChannelId: id,
                UserId: userJWT.id,
                state: true
            }
        });

        if(!connection){
            return res.status(404).json({
                msg: `There is no connection with ID ${id}`
            });
        }

        //await connection.destroy();

        await connection.update({state: false});

        res.json({
            connection
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}




module.exports = {
    createConnection,
    getConnections,
    deleteConnection,
    createTwitterConnection,
    createLinkedInConnection
}

