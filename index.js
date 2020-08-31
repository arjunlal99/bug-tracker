var express = require('express');
var app = express();
require('dotenv').config();
app.set('view engine', 'pug');

var crypto = require('crypto');
const bodyparser = require('body-parser');//body parser
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

const auth = require('./auth/auth.js');
const report_api = require('./models/report.js');
const project_api = require('./models/project.js');
const admin_api = require('./models/admin.js');
const { checkPassword } = require('./models/admin.js');



/*
//mongoose intialization
var mongoose = require('mongoose');
const { json } = require('body-parser');
var Schema = mongoose.Schema;
const conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
conn.once('open', () => {
    console.log('MongoDB successfully connected')
});
//user database schema
var userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    reports: Array
});

var userModel = conn.model('user',userSchema);//usermodel

app.get('/', (req,res) => {
    userModel.find((err,docs) => {
        if(err){
            console.log(err);
        }
        else{
            res.send(docs);
        }
    })
});


//signup endpoint
app.post('/api/auth/signup', (req,res) => {
    var user_instance = new userModel({
        email: req.body.email,
        username: req.body.username,
        password: crypto.createHmac('sha256', process.env.KEY).update(req.body.password).digest('hex'),
        reports: []
    })

    user_instance.save((err) => {
        if(err){
            console.log(err);
        }
        else{
            res.send('Success')
        }
    })
});

//login endpoint to generate access token and create a file to for the user and access token
app.post('/api/auth/login', (req,res) => {
    console.log(req.header)
    userModel.find({email : req.body.email}, (err,docs) => {
        if (docs.length == 0){
            res.json({success: false, message: "user not found"})
        }
        else if (crypto.createHmac('sha256', process.env.KEY).update(req.body.password).digest('hex') == docs[0].password){
            const token = jwt.sign({user:req.body.email}, process.env.SECRET, {expiresIn: 3600} )
            res.json({success: true, token: token})
         //   console.log(jwt.verify(token, process.env.SECRET))
            
        }
        else{
            res.json({success: false, message: "Incorrect password"}) 
        }
    })
})


*/

app.get('/', (req,res) => {
    res.cookie('token', 'adfadfadfe').send('cookie set');
})


//project endpoints
app.get('/api/projects', (req,res) => {
    project_api.allProjects().then((docs) => {
        res.json({success:true, projects:docs})
    }).catch((err) => {
        res.json({success: false, error: err})
    })
})


//get specfic project using project_name
app.get('/api/project/:project_name', (req,res) => {
    project_api.getProject(req.params.project_name).then((docs) => {
        res.json({success: true, project: docs})
    }).catch((err) => {
        res.json({success:false, error: err})
    })
})


//report endpoints
app.get('/api/reports/:project', (req,res) => {
    report_api.allReports(req.params.project).then((docs) => {
        res.json({success: true,reports : docs})
    }).catch((err) => {
        res.json({success: false, error: err})
    })
})

//get specific report using the report_id
app.get('/api/report/:reportid', (req,res) => {
    report_api.getReport(req.params.reportid).then((docs) => {
        res.json({success: true,report : docs})
    }).catch((err) => {
        res.json({success: false, error: err})
    })
})


//admin setup
app.get('/admin', (req,res) => {
    res.render('admin');
})

app.get('/admin/dashboard', (req,res) => {
    console.log(req.cookies);
    res.render('admin-dashboard');
})


app.post('/api/admin/login', (req,res) => {
    admin_api.adminExists(req.body.username).then((docs) =>{
        if (docs == false){
            res.json({success: false, message: "User does not exist"})
        }
        else{
            if (admin_api.checkPassword(req.body.password,docs.password)){
                var token = jwt.sign({user:docs.username}, process.env.SECRET, {expiresIn: 3600} );
                res.cookie('token',token);
                res.redirect('/admin/dashboard');
                
            }
            else{
                res.json({success : false, message: "Incorrect Password"})
            }
        }
    }).catch((err) => {
        res.json({success: false, message : err})
    })
})


//listener
var listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening at port ',listener.address().port)
})