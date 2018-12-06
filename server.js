const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var _ = require('lodash');
var async = require("async");
var cron = require('node-cron');
var ObjectId = require('mongodb').ObjectId;
const initializeDatabases = require('./services/mongo-connection');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let port = process.env.PORT || 3000;
app.set('port', port);

const packages = {
    express,
    app,
    request,
    _ ,
    async,
    cron,
    ObjectId

};
initializeDatabases().then(client => {
    db = client.db('URLS');  
    require('./routes')(packages,db)
    
  }).catch(err => {
      console.log(err);
    console.error('Failed to make all database connections!')
    process.exit(1)
  })
                
app.listen(app.get('port'), (err) => {
    console.log(`Server running on port: ${app.get('port')}`);
})