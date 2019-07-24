let tokenHelper = require('../helper/helperJWT');
let DB = require("../config/conexao");
let conexao = new DB;
let jwthelper = new tokenHelper();

module.exports = function() {
    return {
        add: function(req) {
            logger.log('info', '[business-commentSolicitationBO] Method add started.');
            let token = req.headers.authorization
            return new Promise(function (resolve, reject) {

                try{
                    logger.log('info', '[business-commentSolicitationBO] decoding token.');
                    rtoken = jwthelper.decodedToken(token)
                }catch(error){
                    logger.log('info', '[business-commentSolicitationBO] error decoding the token.');
                    let result = {status:500,body:error}
                    reject(result);
                }
                
                if(!req.body.solicitationId || !req.body.comment){
                    logger.log('info', '[business-commentSolicitationBO] Required fields are empty.');
                    let result = {status:422,body:'Fill in the required fields.'}
                    reject(result);
                }
                
                let parameter = [req.body.solicitationId,req.body.comment,rtoken.id];

                conexao.execSQLQuery('INSERT INTO `app`.`comments_requests` (`ID_REQUEST`, `COMMENT`,\
                `CREATE_DATE`, `CREATE_USER`, `IND_STATUS`) VALUES (?, ?, NOW(), ?, 1)',parameter)
                .then(function(result){
                    if(result.affectedRows){
                        logger.log('info', '[business-commentSolicitationBO] post comment successfully created.');
                        let resultReturn = {status:204,body:""}
                        resolve(resultReturn);
                    }
                }).catch(function (erro) {
                    logger.log('error', '[business-commentSolicitationBO] There was an error inserting the comment.', erro);
                    let result = {status:500,body:erro}
                    reject(result);
                });
                
            })
        },

        getAllById: function(req){
            logger.log('info', '[business-commentSolicitationBO] Method getById started.');
            return new Promise(function(resolve, reject){
                try{
                    if(!req.params.id){
                        logger.log('info', '[business-commentSolicitationBO] Required fields are empty.');
                        let result = {status:422,body:'É obrigatorio informar o Id.'}
                        reject(result);
                    }
                    let parameters = [req.params.id]
                    conexao.execSQLQuery("SELECT * FROM REQUESTS WHERE ID = ? AND IND_STATUS = 1",parameters)
                    .then(function(result){
                        if(result.length){
                            logger.log('info', '[business-commentSolicitationBO] Method getById return solictitation.');
                            let resultReturn = {status:200,body:result}
                            logger.log('info', '[business-commentSolicitationBO] Method getById ending.');
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:200,body:[]}
                            resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-commentSolicitationBO] There was an error return the getById.', erro);
                        let result = {status:500,body:erro}
                        reject(result);
                    });
                }catch(error){
                    let result = {status:500,body:error}
                    reject(result);
                }
            });
        },

        deleteById: function(req){
            logger.log('info', '[business-commentSolicitationBO] Method deleteById started.');
            return new Promise(function(resolve, reject){
                try{

                    let token = req.headers.authorization;

                    try{
                        logger.log('info', '[business-commentSolicitationBO] decoding token.');
                        rtoken = jwthelper.decodedToken(token)
                    }catch(error){
                        logger.log('info', '[business-commentSolicitationBO] error decoding the token.');
                        let result = {status:500,body:error}
                        return  reject(result);
                    }

                    if(!req.params.id){
                        logger.log('info', '[business-commentSolicitationBO] Required fields are empty.');
                        let result = {status:422,body:'The id parameter is required'}
                       return reject(result);
                    }
                    let parameters = [rtoken.id,req.params.id,]

                    conexao.execSQLQuery("UPDATE `app`.`requests` SET `IND_STATUS` = 0, DELETE_USER = ?,\
                     DELETE_DATE = NOW() WHERE ID = ? AND IND_STATUS = 1 AND STATUS = 0",parameters)
                    .then(function(result){
                        if(result.affectedRows > 0){
                            logger.log('info', '[business-commentSolicitationBO] The deleteById method deleted the requested id.');
                            let resultReturn = {status:204,body:""}
                            logger.log('info', '[business-commentSolicitationBO] Method deleteById ending.');
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:204,body:""}
                            return resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-commentSolicitationBO] There was an error return the deleteById.', erro);
                        let result = {status:500,body:erro}
                        return reject(result);
                    });
                }catch(error){
                    let result = {status:500,body:error}
                    return reject(result);
                }
            });
        },
    };
};