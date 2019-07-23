var newsBO   = require('../../business/newsBO')();
module.exports = function() {
    return {
        add: function(req, res) {
            newsBO.add(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },

        getLastNews: function(req, res) {
            newsBO.getLastNews(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },

        getAll: function(req, res) {
            newsBO.getAll(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },

        getById: function(req, res) {
            newsBO.getById(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },

        updateById: function(req, res) {
            newsBO.updateById(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        },
       
       deleteById: function(req, res) {
            newsBO.deleteById(req,res).then(function(result) {
                res.status(result.status).json(result.body);
            }).catch(function(error) {
                res.status(error.status).json(error.body);
            });
        }

    };
};

