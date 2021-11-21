var express = require('express');

const weatherController = require('../controllers/weatherController');

var router = express.Router();

//router.get('/:city?/:metric', weatherController.getCityForecast);
router.get('/autocomplete/:cityName', weatherController.getCityName);
router.get('/:city?/:metric', weatherController.getCityForecast);

module.exports = router;
