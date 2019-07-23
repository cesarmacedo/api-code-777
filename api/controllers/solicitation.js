var solictitationBO   = require('../../business/solictitationBO')();
module.exports = function() {
    return {
        add: function(req, res) {
            solictitationBO.add(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },

        getAll: function(req, res) {
            solictitationBO.getAll(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },

        getById: function(req, res) {
            solictitationBO.getById(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        }
    };
};

