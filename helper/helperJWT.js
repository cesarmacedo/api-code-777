require("dotenv-safe").load();
var jwt = require('jsonwebtoken');
module.exports = function() {
  return {
        verifyToken: function(req, res, next) {
            var chain = Promise.resolve();
            chain
            .then(function(){
                let token = req.headers.authorization;
                logger.log('info','[jwtHelper] Start Validating authentication token');
                if (!token || token === ''){
                    logger.error('[jwtHelper] The token does not exist or is empty');
                    throw {code: 403, body: 'The token does not exist or is empty'};
                } else {
                    return token;
                }
            })
            .then(function(token){
                jwt.verify(token, process.env.SECRET, function(error, decoded){
                    if (error){
                        throw error;
                    }
                    logger.log('info',`[jwtHelper] The token is valid with payload token: ${JSON.stringify(decoded)}`);
                    next();
                });
            })
            .catch(function(error){
                console.log(error)
                logger.log('info','[jwtHelper] An error occurred: ', JSON.stringify(error));
                if (error.code || error.code === 403){
                    res.status(403).json({});
                }
                if (error.message || error.message === 'invalid token'){
                    res.status(403).json({});
                };
            });
        },

        decodedToken: function(token){
            return jwt.verify(token, process.env.SECRET, function(error, decoded){
                if (error){
                    throw error;
                }
                return decoded;
            });
        }
    };
};