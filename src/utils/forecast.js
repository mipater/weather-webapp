const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/1cf721e9bef07d3d78797ef74ccbf13d/' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude) + '?units=si'
    request({ url: url, json: true }, (error, response, { error: bodyError, currently, daily }) => {
        if (error) {
            // Viene popolato per errori a livello strutturale come la mancanza di connessione
            callback('Unable to connect to weather service!')
        } else if (bodyError) {
            callback('Weather API Error: ' + bodyError)
        } else {
            callback(undefined, {
                "summary": currently.summary,
                "temperature": currently.temperature,
                "precipchance": currently.precipProbability,
                "preciptype": currently.precipType,
                "humidity": currently.humidity
            })
        }
    })
}

module.exports = forecast