const router = require('express').Router();
// const path = require('path');

// const fileMiddleware = require('../../middleware/file');
const { Book } = require('../../models');
const { getBookError404 } = require('../../utils');

/** Список всех книг. */
router.get('/', (req, res) => {
    Book.find({}, (err, arr) => res.json(arr))
});

/** Детальная информация книги. */
router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    Book.findOne({ id }, (err, book) => {
        if (book) {
            res.json(book)
        } else {
            next(getBookError404(id));
        }
    })
});

/** Добавление новой книги. */
router.post('/', (req, res) => {
    const BookModel = new Book(req.body);

    BookModel.save().then((book) => {
        res.status(201);
        res.json(book);
    }).catch((err) => {
        res.status(500)
        res.json({ message: err });
    })
});

/** Редактирование книги. */
router.put('/:id', (req, res, next) => {
    const { id } = req.params;

    Book.findOne({ id }, (err, book) => {
        if (err) {
            console.log(err)
        }
        if (book) {
            res.json(book);
        } else {
            next(getBookError404(queryId));
        }
    })
});

/** Удаление книги. */
router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    Book.deleteOne({ id }, (err) => {
        if (err) {
            next(getBookError404(id));
        } else {
            res.json('ok');
        }
    })
});

// /** Загрузка файла с книгой. */
// router.post('/upload', fileMiddleware.single('bookFile'), (req, res) => {
//     if (req.file) {
//         const {
//             authors = 'Автор книги',
//             description = 'Краткое описание книги',
//             title = 'Книга'
//         } = req.body || {};
//         const newBook = new Book({
//             title,
//             description,
//             authors,
//             fileName: req.file.filename
//         });
//
//         newBook.saveModel();
//         res.json('Книга успешно загружена. ID: ' + newBook.id);
//     } else {
//         res.json('Ошибка загрузки');
//     }
// });
//
// /** Скачивание файла книги. */
// router.get('/:id/download', (req, res, next) => {
//     const { id } = req.params;
//     const book = Book.findById(id)
//
//     if (book) {
//         const { fileName } = book;
//
//         if (fileName) {
//             const bookPath = path.join(__dirname, '/../../', BOOK_STORE_PATH, fileName);
//
//             res.download(bookPath, 'book.txt', err => next(err));
//         } else {
//             res.json(`Для книги ${id} не загружен текст`);
//         }
//     } else {
//         next(getBookError404(id));
//     }
// });

module.exports = router;
