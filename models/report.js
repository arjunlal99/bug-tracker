require('dotenv').config({path: '../.env'});
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const conn = mongoose.createConnection(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
conn.once('open', () => {
    console.log("Report connection successful");
  //  getReport('2123456').then(docs => console.log(docs))
});

var reportSchema = new Schema({
    report_id: String,
    title: String,
    type: String,
    priority: String,
    labels: String,
    status: String,
    environment: String,
    summary: String,
    steps_to_reproduce: String,
    expected_result: String,
    actual_result: String,
    reporter: String,
    project: String

})

var reportModel = conn.model('report',reportSchema);


//function to add new report
function addReport(report){

}

//function to get all reports under a specific project
function allReports(project){
    return new Promise((resolve,reject) => {
        reportModel.find({project: project},(err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs[0])
            }
        })
    })
}


//function to get a specific report
function getReport(report_id){
    return new Promise((resolve,reject) => {
        reportModel.find({report_id: report_id}, (err,docs) => {
            if (err){
                return reject(err)
            }
            else{
                resolve(docs)  //since only one object should be found
            }
        })
    })
}

module.exports = {
    reportModel,
    addReport,
    allReports,
    getReport
}