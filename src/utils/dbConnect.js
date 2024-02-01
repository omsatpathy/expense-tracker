const mysql = require('mysql2');
const util = require('util');

function connectDb() {
    const connection = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        password: process.env.MYSQL_PASSWORD
    });
    
    connection.connect((err) => {
        if(err) {
            console.log(err.message);
        } else {
            console.log("Connection succesfull.");
        }
    });
    
    const query = util.promisify(connection.query).bind(connection);
    
    return [query, connection];
}

const execute = async (qry) => {
    const [query, connection] = connectDb();
    try {
        const results = await query(qry);
        return results;
    } catch(err) {
        return err;
    } finally {
        disconnectDb(connection);
    }
}

function disconnectDb(connection) {
    connection.end((err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("Connection terminated.");
        }
    });
}

module.exports = { execute };