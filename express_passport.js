const MongoStore = require('connect-mongo');
const express = require('express')
const session = require('express-session');
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express()

const { User } = require('./src/models');

/**
 * Аутентификация пользователя.
 *
 * @param {String} login Введенный логин.
 * @param {String} password Пароль.
 * @param {Function} done Коллбэк для результатов проверки.
 */
function verify (login, password, done) {
    User.findOne({ login }, (err, user) => {
        if (err) { return done(err) }
        if (user) {
            user.comparePassword(password, (err, isMatch) => {
                if (err) { return done(err) }
                if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            })
        } else {
            return done(null, false)
        }
    })
}

//  Добавление стратегии для использования.
passport.use('local', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: false,
}, verify))

// Конфигурирование Passport для сохранения пользователя в сессии.
passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

// Получение сохраненного пользователя.
passport.deserializeUser((id, cb) => {
    User.findOne({ id }, (err, user) => {
        if (user) {
            cb(null, user)
        } else {
            return cb(err)
        }
    })
})

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/src/views'));
app.use(require('body-parser').urlencoded({ extended: true }))

const {
    db_mongoose_db_name,
    db_mongoose_login,
    db_mongoose_password
} = process.env;

// Подключение бд для работы с сессиями.
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.passport_secret,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${db_mongoose_login}:${db_mongoose_password}@ndse-cluster.whdwb.mongodb.net`,
        dbName: db_mongoose_db_name,
        stringify: false
    })
}));

app.use(passport.initialize())
app.use(passport.session())

/** Страница с приветствием. */
app.get('/user/home', (req, res) => {
    const { user } = req;
    const url = 'user/home';
    const renderData = {
        title: 'Home',
        model: null
    };

    if (user) {
        res.render(url, {
            ...renderData,
            model: user
        });
    } else {
        res.render(url, renderData);
    }
})

/** Страница с формой входа. */
app.get('/user/login', (req, res) => {
    res.render('user/login', {
        title: 'Вход',
        model: {},
        message: ''
    });
})

/** Страница с формой регистрации. */
app.get('/user/signup', (req, res) => {
    res.render('user/signup', {
        title: 'Новая учетная запись',
        user: {}
    });
});

/** Аутентификация пользователя. */
app.post('/user/login', (req, res, next) => {
    const { login } = req.body;

    passport.authenticate('local', (err, user) => {
        if (err) { return next(err); }
        if (!user) {
            return res.render('user/login', {
                title: 'Вход',
                message: 'Неверный логин или пароль',
                model: { login }
            });
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }

            return res.redirect('home');
        });
    })(req, res, next);
})

/** Страница просмотра профиля. */
app.get('/user/me', (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (req.session) {
            req.session.returnTo = req.originalUrl || req.url
        }
        return res.redirect('login')
    }
    next()
},
    (req, res) => {
        res.render('user/view', {
            title: 'Профиль',
            model: req.user
        });
    }
)

/** Сохранение нового профиля. */
app.post('/user/signup', (req, res) => {
    const UserModel = new User(req.body);

    UserModel.save().then((user) => {
        req.logIn(user, (err) => {
            if (err) { return next(err); }

            return res.redirect('home');
        });
    }).catch((err) => {
        res.status(500)
        res.send(err)
    })
})

/** Выход из учетной записи. */
app.get('/user/logout', (req, res) => {
    req.logout()
    res.redirect('home')
})

async function start () {
    try {
        await mongoose.connect(
            `mongodb+srv://${db_mongoose_login}:${db_mongoose_password}@ndse-cluster.whdwb.mongodb.net/${db_mongoose_db_name}?retryWrites=true&w=majority`
        )

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start();
