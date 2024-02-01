const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const protect =  asyncHandler( async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next(); 
        } catch(error) {
            res.status(401);
            throw new Error('Not authorized, invalid token.');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, invalid token.');
    }
});

module.exports = { protect };