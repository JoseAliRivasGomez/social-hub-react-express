const express = require("express")
const router = express.Router();

const postTypesController = require('../controllers/postTypes.controller')
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT); //Se aplica este middleware a todas las rutas porque esta antes de todas

router.get("/", postTypesController.getPostTypes);

module.exports = router;