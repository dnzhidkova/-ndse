/**
 * @param {Object} dateObj Объект даты.
 * @returns {Number} Дата в календарном месяце.
 */
function getDate(dateObj) {
    return dateObj.getDate()
}

/**
 * @param {Object} dateObj Объект даты.
 * @param {Boolean} isLocal Признак, что нужно вернуть локальное название месяца.
 * @returns {String|Number} Название месяца или его номер (начиная с 0).
 */
function getMonth(dateObj, isLocal) {
    return isLocal ? dateObj.toLocaleString('default', { month: 'long' }) : dateObj.getMonth()
}

/**
 * @param {Object} dateObj Объект даты.
 * @returns {Number} Год.
 */
function getYear(dateObj) {
    return dateObj.getFullYear()
}

/**
 * @param {Object} dateObj Объект даты.
 * @param {String} periodType Название типа периода.
 * @returns {String} Значение для указанного временного периода.
 */
export function getPeriodValue(dateObj, periodType) {
    const handlers = {
        date: () => getDate(dateObj),
        month: () => getMonth(dateObj, true),
        year: () => getYear(dateObj)
    }

    return handlers[periodType] && handlers[periodType]()
}

/**
 * Добавляет к дате указанное значение выбранного типа.
 *
 * @param {Date} dateObj Объект даты.
 * @param {String} periodType Название типа периода.
 * @param {String} periodValue Значение периода.
 */
export function addPeriod(dateObj, periodType, periodValue) {
    const handlers = {
        date: () => {
            dateObj.setDate(getDate(dateObj) + periodValue)
        },
        month: () => {
            dateObj.setMonth(getMonth(dateObj) + periodValue)
        },
        year: () => {
            dateObj.setFullYear(getYear(dateObj) + periodValue)
        }
    }

    handlers[periodType] && handlers[periodType]()
}
