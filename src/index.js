const http = require('http')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')

require('dotenv').config()

const accessKey = process.env.WEATHERSTACK_API_KEY
const { _ } = yargs(hideBin(process.argv)).argv
const cityName = _[0]

if (cityName) {
    const url = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${cityName}`

    const request = http.get(url, (response) => {
        const statusCode = response.statusCode
        let rawData = ''

        if (statusCode !== 200) {
            console.error(`Status Code: ${statusCode}`)
            return
        }

        response.setEncoding('utf8')
        response.on('data', (chunk) => rawData += chunk)
        response.on('end', () => {
            console.log(JSON.parse(rawData))
        })
    })

    request.on('error', (e) => {
        console.error(`Got error: ${e.message}`)
    })
} else {
    console.log('Укажите название города. Например:\nnode src/index.js Москва')
}
