const express = require('express');
const userRouter = express.Router();

const { registerUser } = require('../controllers/user/register');
const { loginUser } = require('../controllers/user/login');

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

module.exports = { userRouter };

