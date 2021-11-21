const axios = require('axios');
const { response } = require('express');
const { SequentialRoundRobin } = require('round-robin-js');

const HttpError = require('../util/http-error');

const KEY1 = process.env.API_KEY1;
const KEY2 = process.env.API_KEY2;
const KEY3 = process.env.API_KEY3;
const sequentialTable = new SequentialRoundRobin([KEY1, KEY2, KEY3]);

const getCityForecast = async (req, res, next) => {
    let forecast;
    const cityKey = req.params.city;
    const { value } = sequentialTable.next();
    console.log(`cityKey=${cityKey}`);
    try {
        let response = await axios.get(
            `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${value}&metric=true`
        );
        forecast = response.data;
    } catch (err) {
        console.log(
            `statusText=${err.response.statusText} status=${err.response.status}`
        );
        return next(
            new HttpError(err.response.statusText, err.response.status)
        );
    }
    if (!response) {
        return next(new HttpError('Could not get forecast', 404));
    }
    res.json(forecast);
};
const getCityName = async (req, res, next) => {
    let autocomplete;
    const cityName = req.params.cityName;
    const { value } = sequentialTable.next();
    try {
        let response = await axios.get(
            `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${value}&q=${cityName}`
        );
        autocomplete = response.data.map((element) => {
            return {
                city: element.LocalizedName,
                cityKey: element.Key,
                country: element.Country.LocalizedName,
            };
        });
    } catch (err) {
        console.log(
            `statusText=${err.response.statusText} status=${err.response.status}`
        );
        return next(
            new HttpError(err.response.statusText, err.response.status)
        );
    }
    if (!response) {
        return next(new HttpError('Could not find the place', 404));
    }
    res.json(JSON.stringify(autocomplete));
};

exports.getCityForecast = getCityForecast;
exports.getCityName = getCityName;
