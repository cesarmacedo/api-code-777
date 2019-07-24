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
                    return reject(result);
                }
                
                if(!req.body.solicitationId || !req.body.comment){
                    logger.log('info', '[business-commentSolicitationBO] Required fields are empty.');
                    let result = {status:422,body:'Fill in the required fields.'}
                    return reject(result);
                }

                if(!Number.isInteger(req.body.solicitationId)){
                    logger.log('info', '[business-commentSolicitationBO] Field solicitationId is invalid');
                    let result = {status:422,body:'requestitationId must be an integer.'}
                    return reject(result);
                }
                
                let parameter = [req.body.solicitationId,req.body.comment,rtoken.id];

                conexao.execSQLQuery('INSERT INTO `app`.`comments_requests` (`ID_REQUEST`, `COMMENT`,\
                `CREATE_DATE`, `CREATE_USER`, `IND_STATUS`) VALUES (?, ?, NOW(), ?, 1)',parameter)
                .then(function(result){
                    if(result.affectedRows){
                        logger.log('info', '[business-commentSolicitationBO] post comment successfully created.');
                        let resultReturn = {status:204,body:""}
                        return resolve(resultReturn);
                    }
                }).catch(function (erro) {
                    logger.log('error', '[business-commentSolicitationBO] There was an error inserting the comment.', erro);
                    let result = {status:500,body:erro}
                    return reject(result);
                });
                
            })
        },

        getAllById: function(req){
            logger.log('info', '[business-commentSolicitationBO] Method getAllById started.');
            return new Promise(function(resolve, reject){
                try{

                    if(!req.params.id){
                        logger.log('info', '[business-commentSolicitationBO] Required fields are empty.');
                        let result = {status:422,body:'Parameters Id is required'}
                        return reject(result);
                    }

                    if(!Number.isInteger(req.params.id)){
                        logger.log('info', '[business-commentSolicitationBO] Field solicitationId is invalid');
                        let result = {status:422,body:'requestitationId must be an integer.'}
                        return reject(result);
                    }

                    let parameters = [req.params.id]
                    conexao.execSQLQuery("SELECT CR.ID, CR.ID_REQUEST, CR.COMMENT,CR.CREATE_DATE,\
                    CR.CREATE_USER, U.NAME USER_NAME, DATE_FORMAT(CR.CREATE_DATE, '%d%/%m%/%Y') DATE_FORMAT \
                    FROM comments_requests CR \
                    jOIN users U ON CR.CREATE_USER = U.ID where CR.ID_REQUEST = ? AND CR.IND_STATUS = 1",parameters)
                    .then(function(result){
                        if(result.length){
                            logger.log('info', '[business-commentSolicitationBO] Method getAllById return solictitation.');
                            let resultReturn = {status:200,body:result}
                            logger.log('info', '[business-commentSolicitationBO] Method getAllById ending.');
                            return resolve(resultReturn);
                        }else{
                            let resultReturn = {status:200,body:[]}
                            return resolve(resultReturn);
                        }
                    }).catch(function (erro) {
                        logger.log('error', '[business-commentSolicitationBO] There was an error return the getAllById.', erro);
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