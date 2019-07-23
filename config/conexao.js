const mysql = require('mysql');
let config = require('./settings');
require ("../helper/winston");

class Conexao {
    execSQLQuery(sqlQry,parameters){
        return new Promise (function (resolve, reject){
            const connection = mysql.createConnection({
                host     : config.host,
                port     : config.port,
                user     : config.user,
                password : config.password,
                database : config.database
            });

            connection.query(sqlQry, parameters, function(error, results){
                logger.log('info', 'Starting connection to bank');
                if(error){
                    logger.log('info', 'An error occurred while performing the query');
                    reject(error);
                }else{
                    logger.log('info', 'The query returned a result',results);
                    connection.end();
                    logger.log('info', 'Ending connection to bank');
                    resolve(results)
                }
            });
        
        })
    }
}
module.exports = Conexao;