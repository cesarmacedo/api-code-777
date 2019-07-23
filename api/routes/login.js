var Helper = require('../../helper/helperJWT');

module.exports = function(app) {
    var controller = app.controllers.login;
    var helper = new Helper();
   
    app.route('/v1/login')
        .post(controller.login)
    
    app.route('/v1/teste')
        .post(helper.verifyToken, controller.teste);

}