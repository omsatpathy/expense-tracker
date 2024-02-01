const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware')

const { userRouter } = require('./routes/userRoutes')
const { expenseRouter } = require('./routes/expenseRoutes')

const app = express();
const PORT = process.env.PORT || 4000;

// helper middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'utils'));

// route handlers
app.use('/v1/user', userRouter);
app.use('/v1/expense', expenseRouter)

// error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Server running at port ", PORT);
    }
})