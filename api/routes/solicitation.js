var Helper = require('../../helper/helperJWT');

module.exports = function(app) {
    var controller = app.controllers.solicitation;
    var helper = new Helper();
   
    app.route('/v1/solicitation')
        .post(controller.add)

    app.route('/v1/solicitation')
        .get(controller.getAll)

    app.route('/v1/solicitation/:id')
        .get(controller.getById)
    
}