const {request, response} = require('express');
const {Channel} = require('../models/db');

const getChannels = async (req = request, res = response) => {

    try {

        const channels = await Channel.findAll({
            where: {
                state: true
            }
        });

        res.json({
            channels
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}


module.exports = {
    getChannels,
}



