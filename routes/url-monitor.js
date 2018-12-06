let router = (packages,db) => {
    let userRouter = packages.express.Router();
    let urlMonitor = require('../controllers/url-controller')(packages,db).monitorUrl; 
    let getUrlDetails = require('../controllers/url-controller')(packages,db).getUrlDetails; 
    let updateUrlDetails = require('../controllers/url-controller')(packages,db).editUrl;  
    let listMonitoredUrls = require('../controllers/url-controller')(packages,db).urlLists;  
    let stopUrlMonitor = require('../controllers/url-controller')(packages,db).stopUrlMonitoring;  
   
    userRouter.route('/monitor')
    .post(urlMonitor);

    userRouter.route('/details')
    .get(getUrlDetails);

    userRouter.route('/update')
    .put(updateUrlDetails);

    userRouter.route('/')
    .get(listMonitoredUrls);

    userRouter.route('/stop/monitor')
    .delete(stopUrlMonitor);


    return userRouter;
}

module.exports = router;