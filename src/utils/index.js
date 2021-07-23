/**
 * Получение текста ошибки 404 для книг.
 *
 * @param {String} id Идентификатор книги.
 */
function getBookError404 (id) {
    return `Book ${id} not found`;
}

module.exports = {
    getBookError404
};
