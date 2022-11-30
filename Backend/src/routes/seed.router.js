const express = require("express")
const router = express.Router();

const seedController = require('../controllers/seed.controller')

router.get("/", seedController.executeSeed);

module.exports = router;