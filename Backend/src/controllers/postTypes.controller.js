const {request, response} = require('express');
const {Post_Type} = require('../models/db');

const getPostTypes = async (req = request, res = response) => {

    try {

        const postTypes = await Post_Type.findAll({
            where: {
                state: true
            },
            order: [
                ['id', 'ASC'],
            ],
        });

        res.json({
            postTypes
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}


module.exports = {
    getPostTypes,
}