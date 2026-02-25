const express = require("express");
const router = express.Router();

const imgController = require("../controllers/imgController");

router.post("/img", imgController.createimg);

module.exports = router;