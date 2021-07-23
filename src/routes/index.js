const router = require('express').Router()

/** Главная страница. */
router.get('/', (req, res) => {
    res.send('<h1>Библиотека<h1>')
})

module.exports = router
