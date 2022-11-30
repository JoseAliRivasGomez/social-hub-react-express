const express = require("express")
const {check} = require('express-validator');
const router = express.Router();

const schedulesController = require('../controllers/schedules.controller')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isTime } = require('../helpers/isTime');

router.use(validarJWT); //Se aplica este middleware a todas las rutas porque esta antes de todas

router.get("/", schedulesController.getSchedules);

router.get("/:id", schedulesController.getSchedule);

router.post("/", 
    [
        check('day', 'Day is required').not().isEmpty(),
        check('day', "Day has to be 'D','L','K','M','J','V','S'").isIn(['D','L','K','M','J','V','S']),
        check('time', 'Time is required').not().isEmpty(),
        check('time', 'Invalid time').custom(isTime),
        validarCampos
    ], schedulesController.createSchedule);

router.put("/:id", schedulesController.updateSchedule);

router.delete("/:id", schedulesController.deleteSchedule);

module.exports = router;