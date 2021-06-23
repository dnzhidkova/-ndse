import readline from 'readline'

/**
 * @param {Number} max Верхняя граница числового интервала.
 * @return {Number} Псевдослучайное число из интервала [0, max).
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const gameCondition = 'Загадано число в диапазоне от 0 до 100. Угадайте!'
const answerTemplate = '\nЧисло: '
const secretNumber = getRandomInt(100)

/**
 * Выводит текст с запросом и ожидает ответ от пользователя.
 * @param {String} outputText Текст для отображения.
 */
const askQuestion = (outputText) => {
    rl.question(outputText + answerTemplate, (answer) => {
        const answerNumber = Number(answer)

        if (answerNumber > secretNumber) {
            console.log('Нет, это много\n')
            askQuestion('Еще раз, нужно меньше ' + answerNumber)

        } else if (answerNumber < secretNumber) {
            console.log('Нет, слишком мало\n')
            askQuestion('Еще раз, нужно больше ' + answerNumber)
        } else if (answerNumber === secretNumber) {
            console.log('Нет, слиш.. А ладно, правильно. Отгадано число - ' + answerNumber)
            rl.close()
        } else {
            console.log('Число, пожалуйста. Целое, меньше 100, даже 0 можно. А это что?\n')
            askQuestion('Еще раз')
        }
    })
}

askQuestion(gameCondition)
