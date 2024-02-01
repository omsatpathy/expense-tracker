const asyncHandler = require("express-async-handler");
const { execute } = require('../../utils/dbConnect')
const {sendResponse} = require('../../utils/sendResponse')
const mysql = require('mysql2');

const _fetchExpenseByCategory = () => `        
    SELECT 
        c.name, e.amount, e.description, e.details, e.date
    FROM
        categories c
            JOIN
        expenses e ON c.id = e.category_id
    WHERE
        e.user_id = ?;
`

const getExpensesByCategory = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const query = mysql.format(_fetchExpenseByCategory(), [id]);

    const resultArr = await execute(query);

    if(resultArr instanceof Error) {
        res.status(400);
        throw new Error(resultArr);
    }

    if(!(resultArr.length)) {
        res.status(404);
        throw new Error('Not authorized.');  
    }

    const resultArrFinal = {};

    resultArr.forEach(transaction => {
        const key = `${transaction.name}`;
        if (!resultArrFinal[key]) {
          resultArrFinal[key] = {
            resultArr: [],
            totalAmount: 0
          };
        }
        resultArrFinal[key].resultArr.push(transaction);
        resultArrFinal[key].totalAmount += parseFloat(transaction.amount);
      });

    return sendResponse(
        res,
        true,
        "Expense data fetched",
        resultArrFinal,
        200
    )

});

module.exports = { getExpensesByCategory };