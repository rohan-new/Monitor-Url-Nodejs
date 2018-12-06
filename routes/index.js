let routes = (packages,db) => {

    let urlRouter = require('./url-monitor')(packages,db);
    let routerConfig = require('../configuration/routes-config');
	packages.app.use(routerConfig.BASE_USER_URL, urlRouter);
}

module.exports = routes;