var express = require('express');

const weatherController = require('../controllers/weatherController');

var router = express.Router();

router.get('/:city', weatherController.getCityForecast);
router.get('/autocomplete/:cityName', weatherController.getCityName);

module.exports = router;
