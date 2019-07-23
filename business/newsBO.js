let tokenHelper = require('../helper/helperJWT');
let DB = require("../config/conexao");
let conexao = new DB;
let jwthelper = new tokenHelper();

module.exports = function() {
    return {
        add: function(req) {
            logger.log('info', '[business-newsnBO] Method add started.');
            let token = req.headers.authorization
            return new Promise(function (resolve, reject) {
                
                if(!req.body.title || !req.body.news){
                    logger.log('info', '[business-newsnBO] Required fields are empty.');
                    let result = {status:422,body:'Preencha os capos obrigatórios.'}
                   return reject(result);
                }
                
                try{
                    logger.log('info', '[business-newsnBO] decoding token.');
                    rtoken = jwthelper.decodedToken(token)
                }catch(error){
                    logger.log('info', '[business-newsnBO] error decoding the token.');
                    let result = {status:500,body:error}
                    return reject(result);
                }

                let parameter = [req.body.title,req.body.news,rtoken.id,1];

                conexao.execSQLQuery('INSERT INTO NEWS (`TITLE`,`NEWS`,`CREATE_DATE`,`UPDATE_DATE`,\
                `DELETE_DATE`,`CREATE_USER`,`DELETE_USER`,`UPDATE_USER`,`IND_STATUS`) VALUES \
                (?,?,NOW(),NULL,NULL,?,NULL,NULL,?)',parameter)
                .then(function(result){
                    if(result.affectedRows){
                        logger.log('info', '[business-newsBO] post news successfully created.');
                        let resultReturn = {status:204,body:""}
                        resolve(resultReturn);
                    }
                }).catch(function (erro) {
                    logger.log('error', '[business-news] There was an error inserting the notice.', erro);
                    let result = {status:500,body:erro}
                    reject(result);
                });
                
            })
        },

        getLastNews: function(){
            logger.log('info', '[business-newsnBO] Method getLastNews started.');
            return new Promise(function(resolve, reject){
                try{
                    conexao.execSQLQuery("SELECT N.ID,N.TITLE,N.NEWS, U.NAME CREATED_USER,\
                     date_format(N.CREATE_DATE,'%d/%m/%Y') DATE_FORMAT, N.CREATE_DATE FROM NEWS N \
                     JOIN USERS U ON U.ID = N.CREATE_USER WHERE N.IND_STATUS = 1 ORDER BY ID DESC LIMIT 1")
                    .then(function(result){
                        if(result.length){
                            logger.log('info', '[business-newsBO] Method getLastNews return last news.');
                            let resultReturn = {status:200,body:result}
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:200,body:""}
                            resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-news] There was an error return the getLastNews.', erro);
                        let result = {status:500,body:erro}
                        reject(result);
                    });
                }catch(error){
                    let result = {status:500,body:error}
                    reject(result);
                }
            });
        },

        getAll: function(req){
            logger.log('info', '[business-newsnBO] Method getAll started.');
            return new Promise(function(resolve, reject){
                try{
                    if(!req.query.results || !req.query.page){
                        logger.log('info', '[business-newsnBO] Required fields are empty.');
                        let result = {status:422,body:'O numero de resultados e a pagina são obrigatorios.'}
                        reject(result);
                    }
                    let parameters = [req.query.results,req.query.page,req.query.title]
                    conexao.execSQLQuery("CALL `app`.`Proc_News_Pagination`(?,?,?)",parameters)
                    .then(function(result){
                        if(result[0].length){
                            logger.log('info', '[business-newsBO] Method getAll return news.');
                            let resultReturn = {status:200,body:result[0]}
                            logger.log('info', '[business-newsBO] Method getAll ending.');
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:200,body:[]}
                            resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-news] There was an error return the getAll.', erro);
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
            logger.log('info', '[business-newsnBO] Method getById started.');
            return new Promise(function(resolve, reject){
                try{

                    let token = req.headers.authorization;

                    try{
                        logger.log('info', '[business-vacancyBO] decoding token.');
                        rtoken = jwthelper.decodedToken(token)
                    }catch(error){
                        logger.log('info', '[business-vacancyBO] error decoding the token.');
                        let result = {status:500,body:error}
                        return  reject(result);
                    }

                    if(!req.params.id){
                        logger.log('info', '[business-newsnBO] Required fields are empty.');
                        let result = {status:422,body:'É obrigatorio informar o Id'}
                        reject(result);
                    }

                    let parameters = [req.params.id]
                    conexao.execSQLQuery("SELECT * FROM NEWS WHERE ID = ? AND IND_STATUS = 1",parameters)
                    .then(function(result){
                        if(result.length){
                            logger.log('info', '[business-newsnBO] Method getById return solictitation.');
                            let resultReturn = {status:200,body:result}
                            logger.log('info', '[business-newsnBO] Method getById ending.');
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:200,body:[]}
                            resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-newsnBO] There was an error return the getById.', erro);
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
            logger.log('info', '[business-newsnBO] Method updateById started.');
            return new Promise(function(resolve, reject){
                try{
                    
                    let token = req.headers.authorization;
                    
                    try{
                        logger.log('info', '[business-newsnBO] decoding token.');
                        rtoken = jwthelper.decodedToken(token)
                    }catch(error){
                        logger.log('info', '[business-newsnBO] error decoding the token.');
                        let result = {status:500,body:error}
                        return reject(result);
                    }

                    if(!req.body.title || !req.body.news){
                        logger.log('info', '[business-newsnBO] Required fields are empty.');
                        let result = {status:422,body:'Preencha os capos obrigatórios.'}
                        return reject(result);
                    }

                    let parameters = [req.body.title,req.body.news,rtoken.id,req.params.id]
                    conexao.execSQLQuery("UPDATE `app`.`news` SET `TITLE` = ?,`NEWS` = ?,\
                    `UPDATE_DATE` = NOW(),`UPDATE_USER` = ? WHERE `ID` = ? AND IND_STATUS = 1",parameters)
                    .then(function(result){
                        if(result.affectedRows > 0){
                            logger.log('info', '[business-newsnBO] update news successfully.');
                            let resultReturn = {status:204,body:""}
                            return resolve(resultReturn);
                        }else{
                            logger.log('info', '[business-newsnBO] update news successfully.');
                            let resultReturn = {status:204,body:""}
                            return resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-newsnBO] There was an error return the updateById.', erro);
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
            logger.log('info', '[business-newsnBO] Method deleteById started.');
            return new Promise(function(resolve, reject){
                try{

                    let token = req.headers.authorization;

                    try{
                        logger.log('info', '[business-newsnBO] decoding token.');
                        rtoken = jwthelper.decodedToken(token)
                    }catch(error){
                        logger.log('info', '[business-newsnBO] error decoding the token.');
                        let result = {status:500,body:error}
                        return  reject(result);
                    }

                    if(!req.params.id){
                        logger.log('info', '[business-newsnBO] Required fields are empty.');
                        let result = {status:422,body:'The id parameter is required'}
                       return reject(result);
                    }
                    let parameters = [rtoken.id,req.params.id,]

                    conexao.execSQLQuery("UPDATE `app`.`news` SET `IND_STATUS` = 0, DELETE_USER = ?, DELETE_DATE = NOW() WHERE ID = ? AND IND_STATUS = 1",parameters)
                    .then(function(result){
                        if(result.affectedRows > 0){
                            logger.log('info', '[business-newsnBO] The deleteById method deleted the requested id.');
                            let resultReturn = {status:204,body:""}
                            logger.log('info', '[business-newsnBO] Method deleteById ending.');
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:204,body:""}
                            return resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-newsnBO] There was an error return the deleteById.', erro);
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