const sendResponse = (res, success, message, data, statusCode) => {
    const response  = {
        success,
        message,
        data,
    };

    res.status(statusCode).json(response);
}

module.exports = { sendResponse };