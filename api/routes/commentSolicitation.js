var Helper = require('../../helper/helperJWT');

module.exports = function(app) {
    var controller = app.controllers.commentSolicitation;
    var helper = new Helper();
   
    app.route('/v1/comment')
        .post(helper.verifyToken, controller.add);

}