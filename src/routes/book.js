const router = require('express').Router();
// const uidGenerator = require('node-unique-id-generator');
// const path = require('path');

// const fileMiddleware = require('../middleware/file');
const { Book } = require('../models');

// const defaultBooks = [1, 2, 3].map(el => ({
//     id: uidGenerator.generateUniqueId(),
//     title: `Книга ${el}`,
//     description: `Краткое описание ${el}-й книги.`,
//     authors: `Автор ${el}-й книги`
// }))
//
// Book.insertMany(defaultBooks, (err) => {
//     if (err) {
//         console.log(err)
//     }
// })

/** Список всех книг. */
router.get('/', (req, res) => {
    Book.find({}, (err, arr) => {
        if (err) {
            console.log(err)
        }

        res.render('book/index', {
            title: 'Список книг',
            list: arr
        });
    })
});

/** Детальная информация книги. */
router.get('/:id', (req, res) => {
    const { id } = req.params;

    Book.findOne({ id }, (err, book) => {
        if (err) {
            console.log(err)
        }
        if (book) {
            res.render('book/view', {
                title: 'Просмотр книги',
                book
            });
        } else {
            res.status(404).redirect('/404');
        }
    })
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
    const BookModel = new Book(req.body);

    BookModel.save().then((book) => {
        res.render('book/view', {
            title: 'Просмотр книги',
            book
        });
    }).catch((err) => {
        console.log(err)
        res.status(500)
    })
});

/** Редактирование книги. */
router.get('/update/:id', (req, res) => {
    const { id } = req.params;

    Book.findOne({ id }, (err, book) => {
        if (err) {
            console.log(err)
        }
        if (book) {
            res.render('book/update', {
                title: 'Редактирование книги',
                book
            });
        } else {
            res.status(404).redirect('/404');
        }
    })
});

/** Сохранение отредактированной книги. */
router.post('/update/:id', (req, res) => {
    const { body, params: { id } } = req;

    Book.findOneAndUpdate({ id }, body, (err) => {
        if (err) {
            console.log(err)
            res.status(404).redirect('/404');
        } else {
            res.redirect(`/books/${id}`);
        }
    })
});

/** Удаление книги. */
router.post('/delete/:id', (req, res) => {
    const { id } = req.params;

    Book.deleteOne({ id }, (err) => {
        if (err) {
            console.log(err)
            res.status(404).redirect('/404');
        } else {
            res.redirect(`/books`);
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
//         newBook.save();
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
