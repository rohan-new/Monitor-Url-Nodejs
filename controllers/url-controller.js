let urlController = ({ async, request, ObjectId, cron},db) => {
    const dbMethods =  require('../models/db-methods')(db, ObjectId);
   
    const utility = require('../utils/utility')(db, request, cron, async);

    const monitorUrl = (req, res) => {
        var url = req.body.url;   
        var data = req.body.data;
        var method = req.body.method;
        var headers = req.headers; 

        async.waterfall([ utility.getUrlDelay(url), dbMethods.insertUrlDetails(url, data, method, headers) ], (err, success)=>{
            if(err) return console.log(err);
            res.json({"success":true, "_id":success.ops[0]._id });
            utility.runScheduler(url);
        });
    }

    const getUrlDetails = (req,res)=>{
        var id = req.query.id ;
        async.waterfall([dbMethods.getUrlDetails(id)], (err, success)=>{
            if(err) return console.log(err);
            console.log(success);
            if(!success.monitor){
                return res.send({success:false})
            }
            let percentileArray = [50, 75, 95, 99];
            let percentile = utility.getPercentile(percentileArray, success.responses);
            res.json({"success":true, "responses":success.responses, "50th_percentile":percentile[0], "75th_percentile":percentile[1], "95th_percentile":percentile[2], "99th_percentile":percentile[3], url: success.url, method: success.method, headers: success.headers})
        }); 
    }
    
    const editUrl = (req, res) => {
       var id = req.query.id;
       var url = req.body.url;   
       var data = req.body.data;
       async.waterfall([dbMethods.updateUrlDetails(id, url, data)], (err, success)=>{
        if(err) return console.log(err);
        console.log(success);
        res.send({success:true, _id: id});
    }); 
    }

    const urlLists = (req, res) => {
        async.waterfall([dbMethods.listAllMonitoredUrl()], (err, success)=>{
         if(err) return console.log(err);
         console.log(success);
         res.send({urls:success});
     }); 
     }

    const stopUrlMonitoring = (req, res) => {
        var id = req.query.id ;
        async.waterfall([dbMethods.stopMonitor(id)], (err, success)=>{
         if(err) return console.log(err);
         res.send({success:true});
        //  utility.stopScheduler(url)
     }); 
     }

     
    return{
        editUrl,
        monitorUrl,
        getUrlDetails,
        urlLists,
        stopUrlMonitoring
        
    }
}

module.exports = urlController ;