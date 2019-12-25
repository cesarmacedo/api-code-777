let tokenHelper = require('../helper/helperJWT');
let DB = require("../config/conexao");
let conexao = new DB;
let jwthelper = new tokenHelper();

module.exports = function() {
    return {

        add: function(req) {
            logger.log('info', '[business-serviceSalesBO] Method add started.');
            let token = req.headers.authorization
            let whatzap = null;
            
            return new Promise(function (resolve, reject) {
                
                logger.log('info', '[business-serviceSalesBO] Start validations');
                
                if(!req.body.title || !req.body.description || !req.body.photo || !req.body.whatzap){
                    logger.log('info', '[business-serviceSalesBO] Required fields are empty.');
                    let result = {status:422,body:'Preencha os capos obrigatórios.'}
                   return reject(result);
                }

                if(req.body.price){
                    if(isNaN(req.body.price.replace('.','').replace(',','.'))){
                        logger.log('info', '[business-serviceSalesBO] The price is not valid: ' + 
                        req.body.price.replace('.','').replace(',','.'));
                        let result = {status:422,body:'The price is not valid.'}
                        return reject(result);
                    }else{
                        req.body.price =  req.body.price.replace('.','').replace(',','.');
                    }
                }

                whatzap =  req.body.whatzap

                for(let i = 0; i < whatzap.length; i++){
                    whatzap = whatzap.replace(' ','')
                }

                logger.log('info', '[business-serviceSalesBO] wahts.' + whatzap);
               
                if(isNaN(whatzap)){
                    logger.log('info', '[business-serviceSalesBO] The whatzap number is not valid: ' + 
                    req.body.whatzap);
                    let result = {status:422,body:'The whatzap number is not valid.'}
                    return reject(result);
                }

                try{
                    logger.log('info', '[business-serviceSalesBO] Decoding token.');
                    rtoken = jwthelper.decodedToken(token)
                }catch(error){
                    logger.log('info', '[business-serviceSalesBO] error decoding the token.');
                    let result = {status:500,body:error}
                    return reject(result);
                }

                logger.log('info', '[business-serviceSalesBO] decoding token successfully.');
                
                logger.log('info', '[business-serviceSalesBO] End validations');

                let parameter = [req.body.title,req.body.price,req.body.description,
                    req.body.photo,req.body.whatzap,rtoken.id,1];

                conexao.execSQLQuery('INSERT INTO services_sales (`TITLE`,`PRICE`,`DESCRIPTION`,`IMAGE`,\
                `CREATE_DATE`,`WHATZAP`,`UPDATE_DATE`,`DELETE_DATE`,`CREATE_USER`,`UPDATE_USER`,`DELETE_USER`,\
                `IND_STATUS`) VALUES (?,?,?,?,NOW(),?,NULL,NULL,?,NULL,NULL,?)',parameter)
                .then(function(result){
                    if(result.affectedRows){
                        logger.log('info', '[business-serviceSalesBO] Post service/sales successfully created.');
                        let resultReturn = {status:204,body:""}
                        return resolve(resultReturn);
                    }
                }).catch(function (erro) {
                    logger.log('error', '[business-serviceSalesBO] There was an error inserting the service/sales.', erro);
                    let result = {status:500,body:erro}
                    return reject(result);
                });
                
            })
        },
        
        getAllPagination: function(req){
            logger.log('info', '[business-serviceSalesBO] Method getAllPagination started.');
            return new Promise(function(resolve, reject){
                try{
                    if(!req.query.results || !req.query.page){
                        logger.log('info', '[business-serviceSalesBO] Required fields are empty.');
                        let result = {status:422,body:'The number of results and the page are required.'}
                        return reject(result);
                    }
                    logger.log('info', `[business-serviceSalesBO] The Parameters send: ${req.query.results},  ${req.query.page},  ${req.query.title}`);
                    let parameters = [req.query.results,req.query.page,req.query.title]
                    conexao.execSQLQuery("CALL `app`.`Proc_Service_Sales_Pagination`(?,?,?)",parameters)
                    .then(function(result){
                        if(result[0].length){
                            logger.log('info', '[business-serviceSalesBO] Method getAllPagination return services and sales.');
                            let resultReturn = {status:200,body:result[0]}
                            logger.log('info', '[business-serviceSalesBO] Method getAllPagination ending.');
                            return resolve(resultReturn);
                        }else{
                            let resultReturn = {status:200,body:[]}
                            return resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-serviceSalesBO] There was an error return the getAllPagination.', erro);
                        let result = {status:500,body:erro}
                        return reject(result);
                    });
                }catch(error){
                    logger.log('error', '[business-serviceSalesBO] There was an error return the getAllPagination.', error);
                    let result = {status:500,body:error}
                    return reject(result);
                }
            });
        },

        getByUserId: function(req){
            logger.log('info', '[business-serviceSalesBO] Method getById started.');
            return new Promise(function(resolve, reject){
                try{

                    logger.log('info', '[business-serviceSalesBO] Validating id parameter.');
                   
                    if(!req.params.id){
                        logger.log('info', '[business-serviceSalesBO] Required fields id are empty.');
                        let result = {status:422,body:'id parameter is required'}
                        return reject(result);
                    }

                    if(isNaN(parseFloat(req.params.id))){
                        logger.log('info', '[[business-serviceSalesBO] Field solicitationId is invalid');
                        let result = {status:422,body:'requestitationId must be an integer.'}
                        return reject(result);
                    }

                    let parameters = [req.params.id]

                    logger.log('info', '[business-serviceSalesBO] Parameters successfully validated.');
                    
                    conexao.execSQLQuery('SELECT ID,TITLE,PRICE,DESCRIPTION,IMAGE,WHATZAP FROM\
                    services_sales WHERE CREATE_USER = ? AND IND_STATUS = 1',parameters)
                    .then(function(result){
                        if(result.length){
                            logger.log('info', '[business-serviceSalesBO] Method getById return solictitation.');
                            let resultReturn = {status:200,body:result}
                            logger.log('info', '[business-serviceSalesBO] Method getById ending.');
                            return resolve(resultReturn);
                        }else{
                            let resultReturn = {status:200,body:[]}
                            return resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-serviceSalesBO] There was an error return the getById.' +  erro);
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
            logger.log('info', '[business-serviceSalesBO] Method deleteById started.');
            return new Promise(function(resolve, reject){
                try{

                    let token = req.headers.authorization

                    logger.log('info', '[business-serviceSalesBO] Validating parameter.');

                    if(!req.params.id){
                        logger.log('info', '[business-serviceSalesBO] Required fields id are empty.');
                        let result = {status:422,body:'id parameter is required'}
                        return reject(result);
                    }
                   
                    if(isNaN(parseFloat(req.params.id))){
                        logger.log('info', '[[business-serviceSalesBO] Field solicitationId is invalid');
                        let result = {status:422,body:'requestitationId must be an integer.'}
                        return reject(result);
                    }else{
                        req.params.id =  parseInt(req.params.id)
                    }

                    logger.log('info', '[business-serviceSalesBO] Parameters successfully validated.');

                    logger.log('info', '[business-serviceSalesBO] started validation token');

                    try{
                        logger.log('info', '[business-serviceSalesBO] Decoding token.');
                        rtoken = jwthelper.decodedToken(token)
                    }catch(error){
                        logger.log('info', '[business-serviceSalesBO] error decoding the token.' + error);
                        let result = {status:500,body:error}
                        return reject(result);
                    }

                    logger.log('info', '[business-serviceSalesBO] decoding token successfully.');

                    let parameters = [rtoken.id,req.params.id,]
    
                    logger.log('info', '[business-serviceSalesBO] End validations');

                    conexao.execSQLQuery("UPDATE `app`.`services_sales` SET `IND_STATUS` = 0, DELETE_USER = ?,\
                    DELETE_DATE = NOW() WHERE ID = ? AND IND_STATUS = 1",parameters)
                    .then(function(result){
                        if(result.affectedRows > 0){
                            logger.log('info', '[business-serviceSalesBO] The deleteById method deleted the requested id.');
                            let resultReturn = {status:204,body:""}
                            logger.log('info', '[business-serviceSalesBO] Method deleteById ending.');
                            resolve(resultReturn);
                        }else{
                            let resultReturn = {status:204,body:""}
                            return resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-serviceSalesBO] There was an error return the deleteById.' +  erro);
                        let result = {status:500,body:erro}
                        return reject(result);
                    });
                }catch(error){
                    logger.log('error', '[business-serviceSalesBO] There was an error return the deleteById.' +  error);
                    let result = {status:500,body:error}
                    return reject(result);
                }
            });
        },
    };
};