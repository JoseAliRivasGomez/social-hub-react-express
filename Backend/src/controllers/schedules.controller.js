const {request, response} = require('express');
const {Schedule} = require('../models/db');

const getSchedules = async (req = request, res = response) => {

    try {

        const {userJWT} = req;

        const schedules = await Schedule.findAll({
            where: {
                user_id: userJWT.id,
                state: true
            },
            order: [
                ['day', 'ASC'],
                ['time', 'ASC'],
            ],
        });

        res.json({
            schedules
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

const getSchedule = async (req = request, res = response) => {

    try {

        const {userJWT} = req;

        const {id} = req.params;

        const schedule = await Schedule.findOne({
            where: {
                id,
                user_id: userJWT.id,
                state: true
            }
        });

        if(!schedule){
            return res.status(404).json({
                msg: `There is no schedule with ID ${id}`
            });
        }
        
        res.json({
            schedule
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

const createSchedule = async (req = request, res = response) => {

    try {

        const {userJWT, body} = req;

        const data = {
            ...body,
            user_id: userJWT.id
        }

        const schedule = Schedule.build(data);
        await schedule.save();

        res.json({
            schedule
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }
}

const updateSchedule = async (req = request, res = response) => {

    try {

        const {userJWT, body} = req;

        const {id} = req.params;

        const schedule = await Schedule.findOne({
            where: {
                id,
                user_id: userJWT.id,
                state: true
            }
        });

        if(!schedule){
            return res.status(404).json({
                msg: `There is no schedule with ID ${id}`
            });
        }
        
        const { user_id, state, ...data } = req.body;

        await schedule.update(data);

        res.json({
            schedule
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}

const deleteSchedule = async (req = request, res = response) => {

    try {

        const {userJWT} = req;

        const {id} = req.params;

        const schedule = await Schedule.findOne({
            where: {
                id,
                user_id: userJWT.id,
                state: true
            }
        });

        if(!schedule){
            return res.status(404).json({
                msg: `There is no schedule with ID ${id}`
            });
        }

        //await schedule.destroy();

        await schedule.update({state: false});

        res.json({
            schedule
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please talk to the admin'
        });
    }

}




module.exports = {
    createSchedule,
    getSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule,
}