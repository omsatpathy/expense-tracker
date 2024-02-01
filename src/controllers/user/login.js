const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const { execute } = require('../../utils/dbConnect');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const _loginUser = () => `
    SELECT email, id, password FROM users 
    WHERE email = ? AND id = ?; 
`

const loginUser = asyncHandler( async (req, res) => {
    const {userData} = req.body;

    if(!userData) {
        res.status(400);
        throw new Error('Provide email, id and password.');
    }

    const query = mysql.format(_loginUser(), [userData.email, userData.id]);
    const resultArr = await execute(query);

    if(!(resultArr.length)) {
        res.status(404);
        throw new Error('User not registerd or invalid credentials.');  
    }

    //check if password is correct
    const passwordCheck = await bcrypt.compare(userData.password, resultArr[0].password);
    if(!passwordCheck) {
        res.status(401);
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: userData.id, email: userData.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
        message: 'User logged in and token sent.',
        token
    });

})

module.exports = { loginUser };