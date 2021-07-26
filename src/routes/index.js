const router = require('express').Router()

/** Главная страница. */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Библиотека'
    })
})

module.exports = router
