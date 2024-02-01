const asyncHandler = require("express-async-handler");
const { execute } = require('../../utils/dbConnect');
const mysql = require('mysql2');
const { sendResponse } = require('../../utils/sendResponse')

const _insertExpense = () => `
    INSERT INTO expenses (user_id ,
        category_id ,
        amount ,
        amount_due ,
        description ,
        details,
        date)
    VALUES (?, ?, ?, ?, ?, ?, curdate());
`

const insertExpenses = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const {expenseData} = req.body;

    expenseData.details = {...expenseData.details, last_updated: null}

    const query = mysql.format(_insertExpense(), [id, expenseData.category_id, expenseData.amount, expenseData.amount, expenseData.description,
    JSON.stringify(expenseData.details) ]);

    const resultArr = await execute(query);

    if(resultArr instanceof Error) {
        res.status(400);
        throw new Error(resultArr);
    }

    return sendResponse(
        res,
        true,
        "Expense data inserted",
        resultArr,
        200
    )
    
                                            
});

module.exports = { insertExpenses };