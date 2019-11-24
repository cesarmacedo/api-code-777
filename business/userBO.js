var md5 = require('md5');
let DB = require("../config/conexao");
let conexao = new DB;
module.exports = function() {
    return {
        register: function(userRegistration) {
            let _this = this;
            return new Promise(function (resolve, reject) {
                logger.log('info', '[business-userBO] Starting method register');
                var parameter = [userRegistration.body.user,md5(userRegistration.body.password),userRegistration.body.email,
                userRegistration.body.apartmentRegistration,userRegistration.body.cpf,userRegistration.body.name,
                userRegistration.body.cpf,userRegistration.body.apartmentBlock,userRegistration.body.apartament_number,
                userRegistration.body.birthDate,]
        
                _this.checkRegister(userRegistration.body.apartmentRegistration,userRegistration.body.cpf)
                .then(function(checkRegisterUser){
                    let resultReturn;
                    if(checkRegisterUser.apartmentRegistration == 'Y' && checkRegisterUser.userRegistration == 'N'){
                        conexao.execSQLQuery("INSERT INTO APP.USERS (USER,PASSWORD,EMAIL,LEVEL_ACESS, \
                            APARTMENT_RESGISTRATION_ID,NAME, CPF, APARTMENT_BLOCK, APARTMENT_NUMBER, BIRTH_DATE, CREATE_DATE, IND_STATUS) \
                             VALUES (?,?,?,0,(SELECT ID FROM APARTMENT_RESGISTRATION WHERE APARTMENT_RESGISTRATION = ? AND CPF = ?) \
                             ,?,?,?,?,date_format(str_to_date(?,'%d/%m/%Y'),'%Y-%m-%d'),NOW(),1)",parameter)
                             .then(function(insertUser){
                                 if(insertUser.affectedRows){
                                    logger.log('info', '[business-userBO] User successfully registered');
                                    resultReturn = {status:201,body:checkRegisterUser}
                                    resolve(resultReturn)
                                 }
                             }).catch(function(error){
                                reject(error);
                             })
                    }
                    else if(checkRegisterUser.apartmentRegistration == 'Y' && checkRegisterUser.userRegistration == 'Y'){
                        logger.log('info', '[business-userBO] user already has registration');
                        resultReturn = {status:409,body:'usuário já possui Cadastro.'}
                        resolve(resultReturn)
                    }
                    else if(checkRegisterUser.apartmentRegistration == 'N' && checkRegisterUser.userRegistration == 'N'){
                        logger.log('info', '[business-userBO] user does not have apartment registration');
                        resultReturn = {status:409,body:'O usuário não possui registro de apartamento.'}
                        resolve(resultReturn)
                    }
                })
               
            })
        },

        checkRegister: function(apartmentRegistration, cpf) {
            logger.log('info', '[business-userBO] Starting method checkRegister');
            return new Promise(function (resolve, reject) {
                let parameterApartmentRegistration = [apartmentRegistration,cpf]
                let parameterUserRegistration = [cpf]
                let checkRegisterUser = {}
                conexao.execSQLQuery('SELECT * FROM APP.APARTMENT_RESGISTRATION R \
                                        WHERE R.APARTMENT_RESGISTRATION = ? AND CPF = ? ',parameterApartmentRegistration)
                .then(function(check){
                    if(check.length > 0){
                        checkRegisterUser.apartmentRegistration ='Y'
                    }else{
                        checkRegisterUser.apartmentRegistration = 'N'
                    }
                }).then(function(){
                   return  conexao.execSQLQuery('SELECT * FROM APP.USERS U WHERE U.CPF = ?',parameterUserRegistration)
                }).then(function(check){
                if(check.length > 0){
                    checkRegisterUser.userRegistration = 'Y'
                }else{
                    checkRegisterUser.userRegistration = 'N'
                }
                }).then(function(){
                    resolve(checkRegisterUser);
                }).catch(function (erro) {
                    logger.log('error', '[business-userBO] An error occurred while validating the user in method checkRegister.', erro);
                    let result = {status:500,body:erro}
                    reject(result);
                });   
            });
        }
    };
};