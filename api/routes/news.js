var Helper = require('../../helper/helperJWT');

module.exports = function(app) {
    var controller = app.controllers.news;
    var helper = new Helper();
   
    app.route('/v1/news')
        .post(helper.verifyToken,controller.add)

    app.route('/v1/news/last')
        .get(helper.verifyToken,controller.getLastNews)

    app.route('/v1/news')
        .get(helper.verifyToken,controller.getAll)

    app.route('/v1/news/:id')
        .get(helper.verifyToken,controller.getById)
    
    app.route('/v1/news/:id')
        .put(helper.verifyToken,controller.updateById)
    
    app.route('/v1/news/:id')
        .delete(helper.verifyToken,controller.deleteById)
    
}