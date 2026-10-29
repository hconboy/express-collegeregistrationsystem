var express = require('express');
var router = express.Router();

/* GET home page. */
// GET home page.
router.get("/", (req, res) => {
  res.redirect("/registry");
});

module.exports = router;
