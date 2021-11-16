const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const weatherRouts = require('./routes/weather-routes');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/weather', weatherRouts);

mongoose
    .connect(MONGODB_URL)
    .then(() => {
        console.log('Connected to %s', process.env.MONGODB_URL);
        console.log('App is running ... \n');
        console.log('Press CTRL + C to stop the process. \n');
        console.log(`Your port is ${process.env.PORT}`);

        app.listen(PORT);
    })
    .catch((err) => {
        console.error('App starting error:', err.message);
        process.exit(1);
    });

// throw 404 if URL not found
//app.all('*', function (req, res) {
//    return apiResponse.notFoundResponse(res, 'Page not found');
//});
