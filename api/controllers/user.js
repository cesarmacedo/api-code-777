var userBO   = require('../../business/userBO')();
module.exports = function() {
    return {
        register: function(req, res) {
            userBO.register(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        }
    };
};

