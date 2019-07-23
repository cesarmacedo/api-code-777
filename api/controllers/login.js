var loginBO   = require('../../business/loginBO')();
module.exports = function() {
    return {
        login: function(req, res) {
            loginBO.login(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }, function(error) {
                res.status(error.status).json(error.body);
            });
        },    

        teste: function(req, res) {
            loginBO.teste(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },
    };
};
