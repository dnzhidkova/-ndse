const router = require('express').Router();
const path = require('path');

const { BOOK_STORE_PATH } = require('../../consts');
const fileMiddleware = require('../../middleware/file');
const { Book } = require('../../models');
const { bookStore } = require('../../store');
const { getBookError404 } = require('../../utils');

// [1, 2, 3].map(el => {
//     const TestBook = new Book({
//         title: `Книга ${el}`,
//         description: `Краткое описание ${el}-й книги.`,
//         authors: `Автор ${el}-й книги`
//     })
//
//     TestBook.saveModel()
// });

/** Список всех книг. */
router.get('/', (req, res) => {
    res.json(bookStore);
});

/** Детальная информация книги. */
router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    const book = Book.findById(id)

    book ? res.json(book) : next(getBookError404(id));
});

/** Добавление новой книги. */
router.post('/', (req, res) => {
    const newBook = new Book(req.body);

    newBook.saveModel();
    res.status(201);
    res.json(newBook);
});

/** Редактирование книги. */
router.put('/:id', (req, res, next) => {
    const { body, params: { id: queryId } } = req;
    const idx = bookStore.findIndex(({ id }) => id === queryId);

    if (idx !== -1) {
        bookStore[idx] = {
            ...bookStore[idx],
            ...body
        }
        res.json(bookStore[idx]);
    } else {
        next(getBookError404(queryId));
    }
});

/** Удаление книги. */
router.delete('/:id', (req, res, next) => {
    const { id: queryId } = req.params;
    const idx = bookStore.findIndex(({ id }) => id === queryId);

    if (idx !== -1) {
        bookStore.splice(idx, 1);
        res.json('ok');
    } else {
        next(getBookError404(queryId));
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

        newBook.saveModel();
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
