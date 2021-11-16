const axios = require('axios');
const KEY = process.env.API_KEY;

const getCityForecast = async (req, res, next) => {
    const cityKey = req.params.city;
    console.log(`cityKey=${cityKey}`);
    let data;
    try {
        let response = await axios.get(
            `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${KEY}&metric=true`
        );
        data = response.data;
    } catch (err) {
        console.log(err);
        return next(
            new HttpError('Could not find the place, Something went wrong', 500)
        );
    }
    res.json(data);
};
const getCityName = async (req, res, next) => {
    const cityName = req.params.cityName;
    try {
        let response = await axios.get(
            `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${KEY}&q=${cityName}`
        );
        const autocomplete = response.data.map((element) => {
            console.log(element);
            return {
                city: element.LocalizedName,
                cityKey: element.Key,
                country: element.Country.LocalizedName,
            };
        });
        console.log(`response=${JSON.stringify(autocomplete)}`);
        res.json(JSON.stringify(autocomplete));
    } catch (e) {
        console.log(e);
    }
};

exports.getCityForecast = getCityForecast;
exports.getCityName = getCityName;
