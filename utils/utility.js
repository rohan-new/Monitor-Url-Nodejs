let util = (db, request, cron, async)=>{

    const dbMethods =  require('../models/db-methods')(db);

    const getUrlDelay = (url)=>{
        return function(callback){
            var start = new Date();
            request(url, function (err, res, body) {
                var delay = new Date() - start;
                console.log(delay)
                callback(null, delay);    
            });
        }
    }
   
    const getPercentile = (percentilesArray,responsesArray)=>{
       let newPercentileArray = percentilesArray.map(percentile=>{
           let index = Math.round((percentile/100) * (responsesArray.length));
            return responsesArray[index] ;
        })

        return newPercentileArray ;
       
    }

    const runScheduler = (url)=>{
        cron.schedule('*/1 * * * * *', () => {
            console.log('running a task every one second');
            async.waterfall([ getUrlDelay(url), dbMethods.updateUrlResponses(url) ])
          });
    }


    return{
        getPercentile,
        getUrlDelay,
        runScheduler
    }
}

module.exports = util;