let tokenHelper = require('../helper/helperJWT');
let DB = require("../config/conexao");
let conexao = new DB;
let jwthelper = new tokenHelper();

module.exports = function() {
    return {
        getAllPagination: function(req){
            logger.log('info', '[business-serviceSalesBO] Method getAllPagination started.');
            return new Promise(function(resolve, reject){
                try{
                    if(!req.query.results || !req.query.page){
                        logger.log('info', '[business-serviceSalesBO] Required fields are empty.');
                        let result = {status:422,body:'The number of results and the page are required.'}
                        return reject(result);
                    }
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
    };
};