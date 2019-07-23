var Helper = require('../../helper/helperJWT');

module.exports = function(app) {
    var controller = app.controllers.news;
    var helper = new Helper();
   
    app.route('/v1/news')
        .post(controller.add)

    app.route('/v1/news/last')
        .get(controller.getLastNews)

    app.route('/v1/news')
        .get(controller.getAll)

    app.route('/v1/news/:id')
        .get(controller.getById)
    
    app.route('/v1/news/:id')
        .put(controller.updateById)
    
    app.route('/v1/news/:id')
        .delete(controller.deleteById)
    
}