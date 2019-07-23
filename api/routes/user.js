module.exports = function(app) {
    var controller = app.controllers.user;
   
    app.route('/v1/user/register')
        .post(controller.register)

}