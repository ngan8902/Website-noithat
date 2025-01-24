var mysql = require('mysql')
const { promisify } = require('util')
require('dotenv').config()


var con = mysql.createConnection({
    host: process.env['MYSQL_HOST'] || "localhost",
    user: process.env['MYSQL_USERNAME'] || "root",
    database: process.env['MYSQL_DB'] || "furniture",
    password: process.env['MYSQL_PASSWORD'] || null
});

const connection = async (cb) => {
    if(con.isConnected) return
    con.connect = promisify(con.connect)
    con.querySync = promisify(con.query)
    await con.connect()
    con.isConnected = true
    console.log("Database is Connected::::::");
    cb && cb();
}

function triggerDatabase() {
    con.query("CREATE DATABASE furniture", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
}

module.exports = {
    con,
    connection,
    triggerDatabase,
}