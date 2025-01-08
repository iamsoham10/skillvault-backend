const express = require("express");
const router = express.Router();

router.get("/resources/:id");
router.post("/resources");
router.put("/resources/:id");
router.delete("/resources/:id");

module.exports = router;
