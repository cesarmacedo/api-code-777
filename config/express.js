var express     = require('express');
var load        = require('express-load');
var bodyParser  = require('body-parser');
var appSettings = require('./settings');

module.exports = function() {
    var app = express();

    app.set('port', appSettings.servicePort);

    app.use(bodyParser.json());
    app.use(require('method-override')());

    load('controllers', {cwd:'api'})
    .then('routes')
    .into(app);

    return app;
};