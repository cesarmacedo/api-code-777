let tokenHelper = require('../helper/helperJWT');
let DB = require("../config/conexao");
let conexao = new DB;
let jwthelper = new tokenHelper();

module.exports = function() {
    return {
        add: function(req) {
            logger.log('info', '[business-solictitationBO] Method add started.');
            let token = req.headers.authorization
            return new Promise(function (resolve, reject) {

                try{
                    logger.log('info', '[business-solictitationBO] decoding token.');
                    rtoken = jwthelper.decodedToken(token)
                }catch(error){
                    logger.log('info', '[business-solictitationBO] error decoding the token.');
                    let result = {status:500,body:error}
                    reject(result);
                }
                
                if(!req.body.title || !req.body.request){
                    logger.log('info', '[business-solictitationBO] Required fields are empty.');
                    let result = {status:422,body:'Fill in the required fields.'}
                    reject(result);
                }
                
                let parameter = [req.body.title,req.body.request,0,rtoken.id];

                conexao.execSQLQuery('INSERT INTO `app`.`requests` (`TITLE`,`REQUEST`,`STATUS`,`CREATE_USER`,\
                `UPDATE_USER`,`DELETE_USER`,`CREATE_DATE`,`UPDATE_DATE`,`DELETE_DATE`,`IND_STATUS`) VALUES\
                (?,?,?,?,NULL,NULL,NOW(),NULL,NULL,1)',parameter)
                .then(function(result){
                    if(result.affectedRows){
                        logger.log('info', '[business-solictitationBO] post solictitation successfully created.');
                        let resultReturn = {status:204,body:""}
                        resolve(resultReturn);
                    }
                }).catch(function (erro) {
                    logger.log('error', '[business-solictitationBO] There was an error inserting the solictitation.', erro);
                    let result = {status:500,body:erro}
                    reject(result);
                });
                
            })
        },

        getAll: function(req){
            logger.log('info', '[business-solictitationBO] Method getAll started.');
            return new Promise(function(resolve, reject){
                try{
                    if(!req.query.results || !req.query.page){
                        logger.log('info', '[business-solictitationBO] Required fields are empty.');
                        let result = {status:422,body:'O numero de resultados e a pagina são obrigatorios.'}
                        reject(result);
                    }
                    let parameters = [req.query.results,req.query.page,req.query.title]
                    conexao.execSQLQuery("CALL `app`.`Proc_Solicitations_Pagination`(?,?,?)",parameters)
                    .then(function(result){
                        if(result[0].length){
                            logger.log('info', '[business-solictitationBO] Method getAll return solictitation.');
                            let resultReturn = {status:200,body:result[0]}
                            logger.log('info', '[business-solictitationBO] Method getAll ending.');
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:200,body:[]}
                            resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-solictitationBO] There was an error return the getAll.', erro);
                        let result = {status:500,body:erro}
                        reject(result);
                    });
                }catch(error){
                    let result = {status:500,body:error}
                    reject(result);
                }
            });
        },

        getById: function(req){
            logger.log('info', '[business-solictitationBO] Method getById started.');
            return new Promise(function(resolve, reject){
                try{
                    if(!req.params.id){
                        logger.log('info', '[business-solictitationBO] Required fields are empty.');
                        let result = {status:422,body:'É obrigatorio informar o Id.'}
                        reject(result);
                    }
                    let parameters = [req.params.id]
                    conexao.execSQLQuery("SELECT * FROM REQUESTS WHERE ID = ? AND IND_STATUS = 1",parameters)
                    .then(function(result){
                        if(result.length){
                            logger.log('info', '[business-solictitationBO] Method getById return solictitation.');
                            let resultReturn = {status:200,body:result}
                            logger.log('info', '[business-solictitationBO] Method getById ending.');
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:200,body:[]}
                            resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-solictitationBO] There was an error return the getById.', erro);
                        let result = {status:500,body:erro}
                        reject(result);
                    });
                }catch(error){
                    let result = {status:500,body:error}
                    reject(result);
                }
            });
        },

        updateById: function(req){4
            logger.log('info', '[business-solictitationBO] Method updateById started.');
            return new Promise(function(resolve, reject){
                try{
                    
                    let token = req.headers.authorization;
                    
                    try{
                        logger.log('info', '[business-solictitationBO] decoding token.');
                        rtoken = jwthelper.decodedToken(token)
                    }catch(error){
                        logger.log('info', '[business-solictitationBO] error decoding the token.');
                        let result = {status:500,body:error}
                        return reject(result);
                    }


                    if(!req.body.title || !req.body.request){
                        logger.log('info', '[business-solictitationBO] Required fields are empty.');
                        let result = {status:422,body:'Fill in the required fields.'}
                        reject(result);
                    }

                    let parameters = [req.body.title,req.body.request,rtoken.id,req.params.id]
                    conexao.execSQLQuery("UPDATE `app`.`requests` SET `TITLE` = ?, `REQUEST` = ?,\
                    `UPDATE_USER` = ?,`UPDATE_DATE` = NOW() WHERE `ID` = ? AND IND_STATUS = 1 AND STATUS = 0",parameters)
                    .then(function(result){
                        if(result.affectedRows > 0){
                            logger.log('info', '[business-solictitationBO] update requests successfully.');
                            let resultReturn = {status:204,body:""}
                            return resolve(resultReturn);
                        }else{
                            logger.log('info', '[business-solictitationBO] update requests successfully.');
                            let resultReturn = {status:204,body:""}
                            return resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-solictitationBO] There was an error return the updateById.', erro);
                        let result = {status:500,body:erro}
                        return reject(result);
                    });
                }catch(error){
                    let result = {status:500,body:error}
                    return reject(result);
                }
            });
        },

        deleteById: function(req){
            logger.log('info', '[business-solictitationBO] Method deleteById started.');
            return new Promise(function(resolve, reject){
                try{

                    let token = req.headers.authorization;

                    try{
                        logger.log('info', '[business-solictitationBO] decoding token.');
                        rtoken = jwthelper.decodedToken(token)
                    }catch(error){
                        logger.log('info', '[business-solictitationBO] error decoding the token.');
                        let result = {status:500,body:error}
                        return  reject(result);
                    }

                    if(!req.params.id){
                        logger.log('info', '[business-solictitationBO] Required fields are empty.');
                        let result = {status:422,body:'The id parameter is required'}
                       return reject(result);
                    }
                    let parameters = [rtoken.id,req.params.id,]

                    conexao.execSQLQuery("UPDATE `app`.`requests` SET `IND_STATUS` = 0, DELETE_USER = ?,\
                     DELETE_DATE = NOW() WHERE ID = ? AND IND_STATUS = 1 AND STATUS = 0",parameters)
                    .then(function(result){
                        if(result.affectedRows > 0){
                            logger.log('info', '[business-solictitationBO] The deleteById method deleted the requested id.');
                            let resultReturn = {status:204,body:""}
                            logger.log('info', '[business-solictitationBO] Method deleteById ending.');
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:204,body:""}
                            return resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-solictitationBO] There was an error return the deleteById.', erro);
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