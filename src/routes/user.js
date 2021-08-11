const router = require('express').Router();
const { User } = require('../models/index');

/** Страница с приветствием. */
router.get('/home', (req, res) => {
    const { user_id } = req.session;
    const url = 'user/home';
    const renderData = {
        title: 'Home',
        model: null
    };

    if (user_id) {
        User.findOne({ id: user_id }, (err, user) => {
            if (user) {
                res.render(url, {
                    ...renderData,
                    model: user
                });
            } else {
                res.status(404);
                res.send(err)
            }
        })
    } else {
        res.render(url, renderData);
    }
});

/** Страница с формой входа. */
router.get('/login', (req, res) => {
    res.render('user/login', {
        title: 'Вход',
        model: {},
        message: ''
    });
});

/** Страница с формой регистрации. */
router.get('/signup', (req, res) => {
    res.render('user/signup', {
        title: 'Новая учетная запись',
        user: {}
    });
});

/** Аутентификация пользователя. */
router.post('/login', (req, res) => {
    const { login, password } = req.body;

    User.findOne({ login }, (err, user) => {
        if (user) {
            user.comparePassword(password, (err, isMatch) => {
                if (isMatch) {
                    req.session.user_id = user.id
                    res.redirect('home');
                } else {
                    res.render('user/login', {
                        title: 'Вход',
                        message: 'Неверный логин или пароль',
                        model: { login }
                    });
                }
            })
        } else {
            res.status(404);
            res.send(err)
        }
    })
})

/** Страница просмотра профиля. */
router.get('/me', (req, res) => {
    const { user_id } = req.session;

    if (user_id) {
        User.findOne({ id: user_id }, (err, user) => {
            if (user) {
                res.render('user/view', {
                    title: 'Профиль',
                    model: user
                });
            } else {
                res.redirect('login');
            }
        })
    } else {
        res.redirect('login');
    }
});


/** Сохранение нового профиля. */
router.post('/signup', (req, res) => {
    const UserModel = new User(req.body);

    UserModel.save().then((user) => {
        req.session.user_id = user.id
        res.redirect('home');
    }).catch((err) => {
        res.status(500)
        res.send(err)
    })
})

/** Выход из учетной записи. */
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500)
            res.send(err)
        } else {
            res.redirect('home');
        }
    });

});

module.exports = router;
