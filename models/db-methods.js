let dbMethods = (db, ObjectId) => {
    
    const insertUrlDetails = (url, data, method, headers)=>{
        return ((delay, callback) =>{
            db.collection('url_details').insertOne({url:url, data:data, headers: headers, responses: [delay], method:method, monitor: true},(err,doc)=>{
                if(err) callback(err);
                callback(null, doc);
            });
        });
    }

    const getUrlDetails = (id)=>{
        return ((callback) =>{
            db.collection('url_details').findOne({_id:ObjectId(id)},{responses:{$slice:-100}},(err,doc)=>{
                if(err) callback(err);
                callback(null, doc);
            });
        });
    }

    const updateUrlDetails = (id, url, data)=>{
        return ((callback) =>{
            db.collection('url_details').updateOne({_id:ObjectId(id)},{$set:{data:data, url:url}},(err,doc)=>{
                if(err) callback(err);
                callback(null, doc);
            });
        });
    }

    const stopMonitor = (id)=>{
        return ((callback) =>{
            db.collection('url_details').remove({_id:ObjectId(id)},(err, doc)=>{
                if(err) callback(err);
                callback(null, doc);
            });
        });
    }

    const listAllMonitoredUrl = ()=>{
        return ((callback) =>{
            db.collection('url_details').find({monitor:true},{monitor:0}).toArray().then((result)=>{
                callback(null, result);
            })
            .catch((err)=>{
                callback(err);
            })
        });
    }

    
    const updateUrlResponses = (url)=>{
        return ((delay, callback) =>{
            db.collection('url_details').updateOne({url:url,monitor: true},{$push:{responses:delay}},(err,doc)=>{
                if(err) callback(err);
                console.log('rr')
                console.log(doc.matchedCount); 
                if(doc.matchedCount == 0){
                    callback(null, doc.matchedCount);
                }else{
                    callback(null, doc);
                }
               
            });
        });
    }

    return{
        insertUrlDetails,
        getUrlDetails,
        updateUrlDetails,
        stopMonitor,
        listAllMonitoredUrl,
        updateUrlResponses
    }
}

module.exports = dbMethods ;