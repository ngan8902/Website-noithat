'use strict'

const {con} = require('../database/mysqlDB')

class UserModel {
    static create = async ({ email, password, fullname, phonenumber, role_id }) => {
        return new Promise((resolve, reject) => {
            const test = con.query('INSERT INTO users SET ?', {
                email, password, fullname, phonenumber, role_id
            }, function (error, results, fields) {
                if(error) {
                    console.log(error)
                    reject(error)
                }

                resolve(results)
            });
        })
    }

    static login = async ({ email, password }) => {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], 
            function (error, results, fields) {
                if (error) throw error;
                const foundCustomer = results[0] ? results[0] : null
                resolve(foundCustomer)
            });
        })
    }

    static updateToken = async ({ id, token }) => {
        return new Promise((resolve, reject) => {
            con.query('UPDATE users SET token = ? WHERE id = ?', [token, id], 
            function (error, results, fields) {
                if (error) reject(error);
                resolve(results)
            });
        })
    }

    static getUserWithRole =async(userId)=>{
        return new Promise((resolve, reject) => {
             con.query("SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE id = ?", [userId], function(error, results, fields){
                 if(error) reject(error)
                 resolve(results)
             })
         })
    }

    static getAllUserWithRole =async () => {
        return new Promise((resolve, reject) => {
             con.query("SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id ", function(error, results, fields){
                 if(error) reject(error)
                 resolve(results)
             })
         })
    }

    static initTableToDB = async () => {
        var sql = 'CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, role_id INT NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, fullname VARCHAR(255) NOT NULL, token VARCHAR(255), phonenumber VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL, FOREIGN KEY (role_id) REFERENCES roles(role_id)) ';
        return con.query(sql);
    }

}

module.exports = UserModel;