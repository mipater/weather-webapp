const request = require('request')

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoicGlhbm9tYWlrIiwiYSI6ImNrNGJld3BnbDA4c3IzcHNidWNleHo4MHgifQ.SQWV1DsmU_w6Fskoc1FhSA&limit=1'

    request({ url: url, json: true}, (error, response, { message, error: bodyError, features }) => {
        if (error) {
            callback('Unable to connect to weather service!')
        } else if (message) {
            callback('Mapbox API Error: ' + message)
        } else if (bodyError) {
            callback('Mapbox API Error: ' + bodyError)
        } else if (features.length === 0) {
            callback('Mapbox API Error: Unable to find location. Try another search.')
        } else {
            callback(undefined, {
                latitude: features[0].center[1],
                longitude: features[0].center[0],
                location: features[0].place_name
            })
        }
    })
}

module.exports = geocode