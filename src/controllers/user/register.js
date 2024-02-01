const { execute } = require('../../utils/dbConnect')
const asyncHandler = require('express-async-handler')
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const _registerUser = () => `
    INSERT INTO users (username, email, password) VALUES (?);
`

const registerUser = asyncHandler(async (req, res) => {
    const {userData} = req.body;

    const reqDataArr = [];
    for(const key in userData) {
        reqDataArr.push(userData[key]);
    }
    reqDataArr.pop();

    //generate encrypted password
    const salt = await bcrypt.genSalt(12)
    const password = await bcrypt.hash(userData.password, salt)

    reqDataArr.push(password);

    // return console.log(reqDataArr);

    const query = mysql.format(_registerUser(), [reqDataArr]);
    const resultArr = await execute(query);

    if(resultArr instanceof Error) {
        res.status(400);
        throw new Error(resultArr);
    }

    res.status(201).json({
        success: true,
        message: 'User created.',
        userData: req.body
    })

});

module.exports = { registerUser };