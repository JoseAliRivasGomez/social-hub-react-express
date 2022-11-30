const {request, response} = require('express');
const {Channel, User, Schedule, Channels_Users, Post, Post_Type, Scheduled_Post, Posts_Channels} = require('../models/db');

const channels = [
    {
        name: 'Twitter'
    },
    {
        name: 'LinkedIn'
    },
]

const postTypes = [
    {
        name: 'Instant'
    },
    {
        name: 'Queued'
    },
    {
        name: 'Scheduled'
    },
]

const executeSeed = async (req = request, res = response) => {

    try {

        // Channels_Users.destroy({
        //     where: {}
        // });
        // Schedule.destroy({
        //     where: {}
        // });
        // User.destroy({
        //     where: {}
        // });
        // Post.destroy({
        //     where: {}
        // });
        // Scheduled_Post.destroy({
        //     where: {}
        // });
        // Posts_Channels.destroy({
        //     where: {}
        // });
        Post_Type.destroy({
            where: {}
        });
        Channel.destroy({
            where: {}
        });

        const channelsSeed = await Channel.bulkCreate(channels);
        const postTypesSeed = await Post_Type.bulkCreate(postTypes);

        res.json('Seed executed');

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}


module.exports = {
    executeSeed,
}