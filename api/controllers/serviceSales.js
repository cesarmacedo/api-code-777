var serviceSalesBO   = require('../../business/serviceSalesBO')();
module.exports = function() {
    return {
        
        getAllPagination: function(req, res) {
            serviceSalesBO.getAllPagination(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },

    };
};

