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
        responsesArray.sort((a,b)=>{
            return (a-b)
        });
        console.log(responsesArray);
       let newPercentileArray = percentilesArray.map(percentile=>{
           let index = Math.round((percentile/100) * (responsesArray.length));
            return responsesArray[index] ;
        });
        return newPercentileArray ;
    }

    const runScheduler = (url)=>{
        cron.schedule('*/1 * * * * *', () => {
            console.log('running a task every one second');
            async.waterfall([ getUrlDelay(url), dbMethods.updateUrlResponses(url) ],function(err, success){
                if(err) return console.log('Url Not Found');
            })
          });
    }

    const stopScheduler = (url)=>{
        let task = cron.schedule('*/1 * * * * *', () => {
            console.log('running a task every one second');
            async.waterfall([ getUrlDelay(url), dbMethods.updateUrlResponses(url) ],function(err, success){
                if(err) return console.log('Url Not Found');
            })
          });
          task.destroy();
    }


    return{
        getPercentile,
        getUrlDelay,
        runScheduler,
        stopScheduler
    }
}

module.exports = util;