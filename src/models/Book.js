const uidGenerator = require('node-unique-id-generator');

const { getBook, setBook } = require('../store/index');

class Book {
    constructor({
        id = uidGenerator.generateUniqueId(),
        title = '',
        description = '',
        authors = '',
        favorite = '',
        fileCover = '',
        fileName = '',
        fileBook = '',
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }

    /**
     * @param {String} id Идентификатор книги.
     * @return {Object} Объект книги.
     */
    static findById (id) {
        return getBook(id)
    }

    /**
     * Сохранение книги.
     */
    save () {
        setBook(this)
    }
}

module.exports = Book;
