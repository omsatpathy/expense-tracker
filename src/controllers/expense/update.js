const asyncHandler = require("express-async-handler");
const { execute } = require('../../utils/dbConnect');
const mysql = require('mysql2');
const { sendResponse } = require('../../utils/sendResponse')

const _updateExpneseAmountDue = () => `
    UPDATE expenses SET amount_due = ? 
    WHERE id = ? and user_id = ?;
`

const _updateExpneseLastUpdated = () => `
    UPDATE expenses 
    SET 
        details = JSON_SET(details, '$.last_updated', CURDATE()) 
    WHERE id = ? and user_id = ?;
`

const _fetchAmountDue = () => `
    SELECT amount_due FROM expenses 
    WHERE id = ? and user_id = ?
`

const updateExpenses = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const {updateData} = req.body;

    const fetchAmountDueQuery = mysql.format(_fetchAmountDue(), [updateData.expense_id, id]);

    const resultArrFetchAmountDue = await execute(fetchAmountDueQuery);

    if(!(resultArrFetchAmountDue.length)) {
        res.status(404);
        throw new Error('Not authorized or invalid question id.');  
    }

    if(resultArrFetchAmountDue instanceof Error) {
        res.status(400);
        throw new Error(resultArrFetchAmountDue);
    }

    let amountRemaining = resultArrFetchAmountDue[0].amount_due - updateData.amount_paid;
    let amountDue = amountRemaining > 0 ? amountRemaining : 0;

    const updateExpneseAmountDueQuery = mysql.format(_updateExpneseAmountDue(), [amountDue, updateData.expense_id, id]);

    const resultArrUpdateExpenseAmountDue = await execute(updateExpneseAmountDueQuery);

    if(resultArrUpdateExpenseAmountDue instanceof Error) {
        res.status(400);
        throw new Error(resultArrUpdateExpenseAmountDue);
    }

    const updateExpneseLastUpdatedQuery = mysql.format(_updateExpneseLastUpdated(), [updateData.expense_id, id]);

    const resultArrUpdateExpneseLastUpdated = await execute(updateExpneseLastUpdatedQuery);

    if(resultArrUpdateExpneseLastUpdated instanceof Error) {
        res.status(400);
        throw new Error(resultArrUpdateExpneseLastUpdated);
    }


    return sendResponse(
        res,
        true,
        "Expense data updated.",
        { resultArrUpdateExpenseAmountDue, resultArrUpdateExpneseLastUpdated },
        200
    )
    
                                            
});

module.exports = { updateExpenses };