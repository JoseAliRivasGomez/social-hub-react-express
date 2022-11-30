const express = require("express")
const {check} = require('express-validator');
const router = express.Router();

const usersController = require('../controllers/users.controller')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/signup', 
    [ 
        check('first_name', 'First name is required').not().isEmpty(),
        check('last_name', 'Last name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('password', 'Password must be at least 8 characters long').isLength({min: 8}),
        check('timeZone', 'Time Zone is required').not().isEmpty(),
        validarCampos
    ], 
    usersController.signup);

router.post(
    '/login', 
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password must be at least 8 characters long').isLength({min: 8}),
        validarCampos
    ], 
    usersController.login);

router.post(
    '/forgotpassword', 
    [
        check('email', 'Email is required').isEmail(),
        validarCampos
    ], 
    usersController.forgotPassword);

router.get('/renew', validarJWT, usersController.revalidateToken);

router.use(validarJWT); //Se aplica este middleware a las siguientes rutas porque esta antes

router.post('/otp/generate', usersController.generateOTP);
router.post('/otp/verify', usersController.verifyOTP);
router.post('/otp/validate', usersController.validateOTP);
router.post('/otp/disable', usersController.disableOTP);

router.get('/logout', usersController.logout);

router.get('/user', usersController.getUser);

router.post("/checkpassword/:id", 
    [
        check('oldPassword', 'Old Password must be at least 8 characters long').isLength({min: 8}),
        validarCampos
    ], usersController.checkPassword);

router.put("/password/:id", 
    [
        check('newPassword', 'New Password must be at least 8 characters long').isLength({min: 8}),
        validarCampos
    ], usersController.updatePassword);

router.put("/:id", 
    [ 
        check('first_name', 'First name is required').not().isEmpty(),
        check('last_name', 'Last name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        validarCampos
    ],  usersController.updateUser);

module.exports = router;