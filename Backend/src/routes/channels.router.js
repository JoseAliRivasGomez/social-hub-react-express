const express = require("express")
const router = express.Router();

const channelsController = require('../controllers/channels.controller')
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT); //Se aplica este middleware a todas las rutas porque esta antes de todas

router.get("/", channelsController.getChannels);

module.exports = router;