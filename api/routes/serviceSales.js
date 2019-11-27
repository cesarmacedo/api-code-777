var Helper = require('../../helper/helperJWT');

module.exports = function(app) {
    var controller = app.controllers.serviceSales;
    var helper = new Helper();
   
    app.route('/v1/servicesales')
        .get(helper.verifyToken,controller.getAllPagination)
    
}