var commentSolicitationBO   = require('../../business/commentSolicitationBO')();
module.exports = function() {
    return {
        add: function(req, res) {
            commentSolicitationBO.add(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },

        getAllById: function(req, res) {
            commentSolicitationBO.getAllById(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },
    };
};

