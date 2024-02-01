const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    const errMessage = err.message ? err.message : "Something\'s wrong";

    res.status(statusCode);
    res.json({
        message: errMessage,
        stack: err.stack
    })
}

module.exports = {
    notFoundHandler,
    errorHandler
}