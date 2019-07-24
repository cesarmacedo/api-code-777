var Helper = require('../../helper/helperJWT');

module.exports = function(app) {
    var controller = app.controllers.solicitation;
    var helper = new Helper();
   
    app.route('/v1/solicitation')
        .post(helper.verifyToken,controller.add)

    app.route('/v1/solicitation')
        .get(helper.verifyToken,controller.getAll)

    app.route('/v1/solicitation/:id')
        .get(helper.verifyToken,controller.getById)
    
}