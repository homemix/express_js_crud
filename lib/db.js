var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'YOUR USERNAME',
    password:'YOUR PASSWORD',
    database:'YOUR DATABASE'
});
connection.connect(function(error){
    if(!!error) {
        console.log(error);
    } else {
        console.log(' DB Connected..!');
    }
});

module.exports = connection;