const router = require('express').Router();
const path = require('path');

const { BOOK_STORE_PATH } = require('../consts');
const fileMiddleware = require('../middleware/file');
const { Book } = require('../models');
const { bookStore } = require('../store');
const { getBookError404 } = require('../utils');

[1, 2, 3].map(el => {
    const TestBook = new Book({
        title: `Книга ${el}`,
        description: `Краткое описание ${el}-й книги.`,
        authors: `Автор ${el}-й книги`
    })

    TestBook.saveModel()
});

/** Список всех книг. */
router.get('/', (req, res) => {
    res.render('book/index', {
        title: 'Список книг',
        list: bookStore
    })
});

/** Детальная информация книги. */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const book = Book.findById(id)

    if (book) {
        res.render('book/view', {
            title: 'Просмотр книги',
            book
        });
    } else {
        res.status(404).redirect('/404');
    }
});

/** Форма добавления новой книги. */
router.get('/create/new', (req, res) => {
    res.render('book/create', {
        title: 'Добавление книги',
        book: {},
    });
});

/** Сохранение новой книги. */
router.post('/create/new', (req, res) => {
    const newBook = new Book(req.body);

    newBook.saveModel();
    res.status(201);
    res.redirect(`/books`);
});

/** Редактирование книги. */
router.get('/update/:id', (req, res) => {
    const { id: queryId } = req.params;
    const idx = bookStore.findIndex(({ id }) => id === queryId);

    if (idx !== -1) {
        res.render('book/update', {
            title: 'Редактирование книги',
            book: bookStore[idx]
        });
    } else {
        res.status(404).redirect('/404');
    }
});

/** Сохранение отредактированной книги. */
router.post('/update/:id', (req, res) => {
    const { body, params: { id: queryId } } = req;
    const idx = bookStore.findIndex(({ id }) => id === queryId);

    if (idx !== -1) {
        bookStore[idx] = {
            ...bookStore[idx],
            ...body
        }
        res.redirect(`/books/${queryId}`);
    } else {
        res.status(404).redirect('/404');
    }
});

/** Удаление книги. */
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const book = Book.findById(id)

    if (book && book.deleteModel()) {
        res.redirect(`/books`);
    } else {
        res.status(404).redirect('/404');
    }
});

/** Загрузка файла с книгой. */
router.post('/upload', fileMiddleware.single('bookFile'), (req, res) => {
    if (req.file) {
        const {
            authors = 'Автор книги',
            description = 'Краткое описание книги',
            title = 'Книга'
        } = req.body || {};
        const newBook = new Book({
            title,
            description,
            authors,
            fileName: req.file.filename
        });

        newBook.save();
        res.json('Книга успешно загружена. ID: ' + newBook.id);
    } else {
        res.json('Ошибка загрузки');
    }
});

/** Скачивание файла книги. */
router.get('/:id/download', (req, res, next) => {
    const { id } = req.params;
    const book = Book.findById(id)

    if (book) {
        const { fileName } = book;

        if (fileName) {
            const bookPath = path.join(__dirname, '/../../', BOOK_STORE_PATH, fileName);

            res.download(bookPath, 'book.txt', err => next(err));
        } else {
            res.json(`Для книги ${id} не загружен текст`);
        }
    } else {
        next(getBookError404(id));
    }
});

module.exports = router;
