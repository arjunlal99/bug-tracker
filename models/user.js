var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();
var crypto = require(crypto);
const conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
conn.once('open', () => {
    console.log("User connection successful");
});


var userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    reports: Array
});


var userModel = conn.model('user', userSchema);

//function to check if user exists
function userExists(user){

}

//function to add new use to databse
//checks if user already exists
function addUser(user){

}

//function to check password of a user
function checkPassword(user, password){

}