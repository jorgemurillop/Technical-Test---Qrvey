
// exportar configuraciones
// si la base no existe la crea
module.exports = {
    PORT: process.env.PORT || 3000,
    DB: process.env.MONGODB || 'mongodb://samongo:qaz112qaz@ds119020.mlab.com:19020/heroku_jvgkqq7r',
    SECRET_TOKEN: 'SECRET123$TOKENQRVEY',
    ENV: process.env.NODE_ENV || 'test'
};