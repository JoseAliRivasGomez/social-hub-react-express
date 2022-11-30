const express = require("express")
const {check} = require('express-validator');
const router = express.Router();

const postsController = require('../controllers/posts.controller')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT); //Se aplica este middleware a todas las rutas porque esta antes de todas

router.get("/", postsController.getPosts);

router.get("/published", postsController.getPublishedPosts);

router.get("/pending", postsController.getPendingPosts);

router.get("/queued", postsController.getQueuedPosts);

router.post("/", 
    [
        check('post', 'Post is required').not().isEmpty(),
        check('ChannelIds', 'Channel ID is required').not().isEmpty(),
        check('ChannelIds', 'Channel ID has to be a number').isArray(),
        validarCampos
    ], postsController.createPost);

router.put("/:id", postsController.updatePost);

router.delete("/:id", postsController.deletePost);

module.exports = router;