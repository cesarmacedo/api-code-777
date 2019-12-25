var Helper = require('../../helper/helperJWT');

module.exports = function(app) {
    var controller = app.controllers.serviceSales;
    var helper = new Helper();
   
    app.route('/v1/servicesales')
        .get(helper.verifyToken,controller.getAllPagination)
        
    app.route('/v1/servicesales')
        .post(helper.verifyToken,controller.add)
    
    app.route('/v1/servicesales/:id')
        .get(helper.verifyToken,controller.getByUserId)

    app.route('/v1/servicesales/:id')
        .delete(helper.verifyToken,controller.deleteById)
    
}