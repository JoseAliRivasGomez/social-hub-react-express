const express = require("express")
const {check} = require('express-validator');
const router = express.Router();

const connectionsController = require('../controllers/connections.controller')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const passport = require("passport");

router.get('/auth/linkedin', [validarJWT, passport.authenticate('linkedin', { state: '' })]);

router.get('/auth/twitter', [validarJWT, passport.authenticate('twitter')]);

router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    assignProperty: 'federatedUser',
    //successRedirect: '/',
    //failureRedirect: 'http://localhost:3000/channels/connect',
    failureRedirect: 'https://social-hub21.herokuapp.com/channels/connect',
  }), connectionsController.createLinkedInConnection
);

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    assignProperty: 'federatedUser',
    //successRedirect: '/',
    //failureRedirect: 'http://localhost:3000/channels/connect',
    failureRedirect: 'https://social-hub21.herokuapp.com/channels/connect',
  }), connectionsController.createTwitterConnection
);

router.use(validarJWT); //Se aplica este middleware a todas las rutas porque esta antes de todas

router.get("/", connectionsController.getConnections);

router.post("/", 
    [
        check('ChannelId', 'Channel ID is required').not().isEmpty(),
        check('ChannelId', 'Channel ID has to be a number').isNumeric(),
        validarCampos
    ], connectionsController.createConnection);

router.delete("/:id", connectionsController.deleteConnection);

module.exports = router;