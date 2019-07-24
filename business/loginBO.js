require("dotenv-safe").load();
var jwt = require('jsonwebtoken');
var md5 = require('md5');
let settings = require('../config/settings');
let DB = require("../config/conexao");
let conexao = new DB;
module.exports = function() {
    return {
        login: function(req) {
            return new Promise(function (resolve, reject) {
                logger.log('info', '[business-loginBO] start method login.');
                var parameter = [req.body.user,md5(req.body.password)]
                conexao.execSQLQuery('SELECT ID,USER,LEVEL_ACESS,EMAIL FROM USERS WHERE USER = ? AND PASSWORD = ? AND IND_STATUS = 1',parameter)
                .then(function(result){
                    if(result.length > 0){
                        logger.log('info', '[business-loginBO] user successfully validated.');
                        var id = result[0].ID;
                        var user = result[0].USER;
                        var email = result[0].EMAIL;
                        var levelAcess = result[0].LEVEL_ACESS;
                        var token = jwt.sign({id,user,email,levelAcess}, process.env.SECRET, {
                        expiresIn: settings.jwtExpiresIn // expires in 5min
                        });
                        let resultReturn = {status:200,body:token}
                        resolve(resultReturn);
                    }else{
                        logger.log('info', '[business-loginBO] User not found.');
                        let resultReturn = {status:403,body:'Invalid login!'}
                        reject(resultReturn);  
                    }
                    resolve(result);
                }).catch(function (erro) {
                    logger.log('error', '[business-loginBO] An error occurred while validating the user.', erro);
                    let result = {status:500,body:erro}
                    reject(result);
                });
            })
        }
    };
};