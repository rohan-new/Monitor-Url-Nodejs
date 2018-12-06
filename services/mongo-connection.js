const MongoClient = require('mongodb').MongoClient
let mongoUrl = require('../configuration/database-config').mongoUrl; 

function connect(url) {
  return MongoClient.connect(url,{useNewUrlParser:true}).then(client =>client)
}
 
module.exports = async function() {
    let databases = await Promise.all([connect(mongoUrl)])
    return databases[0];
}