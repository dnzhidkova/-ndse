const express = require('express');
const cors = require('cors');
const formData = require('express-form-data');

const { Book } = require('./models');

const app = express();
const stor = {
    books: [],
};

[1, 2, 3].map(el => stor.books.push(new Book({
    title: `Книга ${el}`,
    description: `Краткое описание ${el}-й книги.`,
    authors: `Автор ${el}-й книги`
})));

/**
 * Установка ответа для 404 ошибки.
 *
 * @param {Object} res Объект обвета.
 */
function setError404 (res) {
    res.status(404);
    res.json('books | not found');
}

app.use(formData.parse());
app.use(cors());

/** Авторизация пользователя. */
app.post('/api/user/login/', (req, res) => {
    res.status(201);
    res.json({ id: 1, mail: "test@mail.ru" });
});

/** Список всех книг. */
app.get('/api/books/', (req, res) => {
    res.json(stor.books);
});

/** Детальная информация книги. */
app.get('/api/books/:id', (req, res) => {
    const { books } = stor;
    const idx = books.findIndex(({ id }) => id === req.params.id);

    if (idx !== -1) {
        res.json(books[idx]);
    } else {
        setError404(res)
    }
});

/** Добавление новой книги. */
app.post('/api/books/', (req, res) => {
    const { books } = stor;
    const newBook = new Book(req.body);

    books.push(newBook);

    res.status(201);
    res.json(newBook);
});

/** Редактирование книги. */
app.put('/api/books/:id', (req, res) => {
    const { books } = stor;
    const { body, params } = req;
    const idx = books.findIndex(({ id }) => id === params.id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            ...body
    };
        res.json(books[idx]);
    } else {
        setError404(res)
    }
});

/** Удаление книги. */
app.delete('/api/books/:id', (req, res) => {
    const { books } = stor;
    const idx = books.findIndex(({ id }) => id === req.params.id);

    if (idx !== -1) {
        books.splice(idx, 1);
        res.json('ok');
    } else {
        setError404(res)
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
