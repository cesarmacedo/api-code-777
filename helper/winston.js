var winston = require('winston');
const { format } = require('winston');
const { combine, timestamp } = format;
logger = winston.createLogger({
  level: 'info',
  format: combine(
  format.timestamp({
    format: 'DD-MM-YYYY HH:mm:ss'
  }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' })
  ]
});
module.exports = winston;
