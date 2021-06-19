import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { addPeriod, getPeriodValue } from './utils.js'

const { _: commands, $0, ...restParams } = yargs(hideBin(process.argv)).argv
const command = commands[0]
const { d, date, m, month, y, year } = restParams
let resultDate = new Date()
let periodType = null
let periodDiff = null
let result = null

if (d || date) {
    periodType = 'date'
    periodDiff = d || date
} else if (m || month) {
    periodType = 'month'
    periodDiff = m || month
} else if (y || year) {
    periodType = 'year'
    periodDiff = y || year
}

if (command === 'current') {
    result = periodType ? getPeriodValue(resultDate, periodType) : resultDate
} else if (command === 'add') {
    addPeriod(resultDate, periodType, periodDiff)
    result = resultDate
} else if (command === 'sub') {
    addPeriod(resultDate, periodType, -periodDiff)
    result = resultDate
} else {
    result = 'Неизвестная команда: ' + command
}

console.log(result)
