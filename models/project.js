var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();

const conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
conn.once('open', () => {
    console.log("Projects connection successful");
});


var projectSchema = new Schema({
    project_name: String,
    reports: Array
});

var projectModel = conn.model('project',projectSchema);



function addProject(project){

}

//function to get array containing all projects
function allProjects(){
    return new Promise((resolve,reject) => {
        projectModel.find((err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs)
            }
        })
    })
}

//function to return reports of  a project provided the project_name is given
function getProject(project_name){
    return new Promise((resolve,reject) => {
        projectModel.find({project_name:project_name},(err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs)
            }
        })
    })
}


module.exports = {
    projectModel,
    addProject,
    allProjects,
    getProject
}