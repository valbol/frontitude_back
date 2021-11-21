const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const weatherRouts = require('./routes/weather-routes');
const HttpError = require('./util/http-error');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/weather', weatherRouts);
//middleware to handle not existing routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route!', 404);
    throw error;
});
app.use((error, req, res, next) => {
    console.log(`error code=${error.code}`);
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code ?? 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log(
            `Connected to ${process.env.MONGODB_URL}\nPress CTRL + C to stop the process.\nYour port is ${process.env.PORT}`
        );
        app.listen(process.env.PORT);
    })
    .catch((err) => {
        console.error('App starting error:', err.status);
    });
