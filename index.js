const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

const errorMiddleware = require('./src/middleware/error');
const authRouter = require('./src/routes/auth');
const bookApiRouter = require('./src/routes/api/book');
const bookRouter = require('./src/routes/book');
const indexRouter = require('./src/routes');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/src/views'));

// Работа с книгами.
app.use('/api/books', bookApiRouter)
app.use('/books', bookRouter)

// Аутентификация пользователя.
app.use('/api/user/login', authRouter)

// Главная.
app.use('/', indexRouter)

// Обработка ошибок.
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
