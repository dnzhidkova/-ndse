const store = {
    books: [],
};

/**
 * @param {String} bookId Идентификатор книги.
 * @return {Object} Объект книги.
 */
const getBook = (bookId) => {
    const idx = store.books.findIndex(
        ({ id }) => id === bookId
    );

    return idx !== -1 ? store.books[idx] : null
}

/**
 * Добавление книги в хранилище.
 *
 * @param {Object} book Объект книги.
 */
const setBook = (book) => store.books.push(book)

/**
 * Удаление книги из хранилища.
 *
 * @param {String} bookId Идентификатор книги.
 * @return {Boolean} Признак, что книга удалена.
 */
const deleteBook = (bookId) => {
    const idx = store.books.findIndex(
        ({ id }) => id === bookId
    );

    if (idx !== -1) {
        store.books.splice(idx, 1)

        return true
    }

    return false
}

module.exports = {
    bookStore: store.books,
    deleteBook,
    getBook,
    setBook
};
