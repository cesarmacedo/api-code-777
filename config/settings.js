module.exports = {
    host: process.env['host'] = '',
    user: process.env['user'] = '',
    password: process.env['password'] = '',
    database: process.env['database'] = '',
    port: process.env['port'] = 3306,
    servicePort: process.env.servicePort || 5000,
    jwtExpiresIn: process.env['jwtExpiresIn'] = 2000 
};