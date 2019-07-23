require("dotenv-safe").load();
var jwt = require('jsonwebtoken');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var md5 = require('md5');
let DB = require("./config/conexao");
let conexao = new DB;

app.use(bodyParser.json());

app.post('/login', function(req, res){
  var parameter = [req.body.user,md5(req.body.password)]
   conexao.execSQLQuery('SELECT id,user,nivel_acesso,email FROM user where user = ? and password = ?',parameter).then(function(result){
    if(result.length > 0){
      var id = result[0].id;
      var user = result[0].user;
      var email = result[0].email;
      var nivel_acesso = result[0].nivel_acesso;
      var token = jwt.sign({id,user,email,nivel_acesso}, process.env.SECRET, {
      expiresIn: 300 // expires in 5min
      });
      res.status(200).send({ auth: true, token: token });
    }else{
      res.status(500).send('Login inválido!');
    }
  })
})

app.listen(5000, function() {
  console.log("My API is running in port:5000");
});
module.exports = app;