module.exports = (err, req, res, next) => {
    res.status(404);
    res.send(err || '404 | not found');
};
