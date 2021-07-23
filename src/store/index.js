const store = {
    books: [],
};

/**
 * @param {String} bookId Идентификатор книги.
 * @return Объект книги.
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

module.exports = {
    bookStore: store.books,
    getBook,
    setBook
};
