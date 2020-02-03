const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const log = console.log

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views')
const publicDirectoryPath = path.join(__dirname, '../public')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Configura il server per rispondere in base ad uno specifico routing
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Mike'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Mike'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is the help page',
        title: 'Help',
        name: 'Mike'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, locationFullName, locationSimpleName } = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        }  
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: error
                })
            }

            res.send({
                "locationName": locationSimpleName,
                "forecast": {
                    "location": locationFullName,
                    "summary": forecastData.summary,
                    "temperature": forecastData.temperature + ' °C',
                    "precip chance": forecastData.precipchance,
                    "precip type": forecastData.preciptype,
                    "humidity": forecastData.humidity
                }
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

// '*' matcha qualunque sottopagina della sezione Help
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mike',
        errorMessage: 'Help article not found.'
    })
})

// '*' matcha qualunque cosa, mettendo questo caso per ultimo facciamo in modo
// che venga matchato solo se nessuno dei precedenti è valido
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mike',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    log('Server is up on port ' + port)
})