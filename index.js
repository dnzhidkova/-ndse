const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose')
const path = require('path');
const passport = require('passport')

const errorMiddleware = require('./src/middleware/error');
const bookApiRouter = require('./src/routes/api/book');
const bookRouter = require('./src/routes/book');
const userRouter = require('./src/routes/user');
const indexRouter = require('./src/routes');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/src/views'));

const {
    db_mongoose_db_name: db_name,
    db_mongoose_login: login,
    db_mongoose_password: password
} = process.env;

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'werysecret',
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${login}:${password}@ndse-cluster.whdwb.mongodb.net`,
        dbName: db_name,
        stringify: false
    })
}));

// Работа с пользователями.
app.use('/user', userRouter)

// Работа с книгами.
app.use('/api/books', bookApiRouter)
app.use('/books', bookRouter)

// Главная.
app.use('/', indexRouter)

// Обработка ошибок.
app.use(errorMiddleware);

async function start () {
    try {
        await mongoose.connect(`mongodb+srv://${login}:${password}@ndse-cluster.whdwb.mongodb.net/${db_name}?retryWrites=true&w=majority`)

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start();
