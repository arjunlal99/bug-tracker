var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config({path: '../.env'});
var crypto = require('crypto');


const conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
conn.once('open', () => {
    console.log("Admin connection successful");
   // adminExists('arun').then(value => console.log(value))
});


var adminSchema = new Schema({
    username: String,
    password: String
});

var adminModel = conn.model('admin', adminSchema)


function adminExists(username){
    return new Promise((resolve,reject) => {
        adminModel.find({username: username}, (err,docs) => {
            if(err){
                return reject(err)
            }
            else if (docs.length == 0){
                resolve(false)
            }
            else {
                resolve(docs[0])
            }
        })
    })
}

function checkPassword(password, hash){
    if (hash == crypto.createHmac('sha256', process.env.KEY).update(password).digest('hex')){
        return true;
    }
    return false;
}
/*
function addAdmin(username, password){
    var admin_instance = new adminModel({
        username: username,
        password: crypto.createHmac('sha256', process.env.KEY).update(password).digest('hex')
    })

    admin_instance.save((err) => {
        if (err){
            console.log(err)
        }
        else{
            console.log('Success')
        }
    })
}

*/


module.exports = {
    adminModel,
    adminExists,
    checkPassword
}