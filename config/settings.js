module.exports = {
    host: process.env['host'] = 'localhost',
    user: process.env['user'] = 'root',
    password: process.env['password'] = '123456',
    database: process.env['database'] = 'app',
    port: process.env['port'] = 3306,
    servicePort: process.env.servicePort || 5000,
    jwtExpiresIn: process.env['jwtExpiresIn'] = 2000 
};