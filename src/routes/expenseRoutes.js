const express = require('express');
const expenseRouter = express.Router();
const { protect } = require('../middlewares/authMiddleware')

const { insertExpenses } = require('../controllers/expense/insert')
const { updateExpenses } = require('../controllers/expense/update');
const { getExpensesByCategory } = require('../controllers/expense/select');
const { getExpenseRecord } = require('../controllers/expense/getExpenseRecord');

expenseRouter.post('/insert', protect, insertExpenses);
expenseRouter.patch('/update', protect, updateExpenses);
expenseRouter.get('/select', protect, getExpensesByCategory);
expenseRouter.get('/pdf', protect, getExpenseRecord);

module.exports = { expenseRouter };

