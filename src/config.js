
// exportar configuraciones
// si la base no existe la crea
module.exports = {
    port: process.env.PORT || 3000,
    db: process.env.MONGODB || 'mongodb://samongo:qaz112qaz@ds119020.mlab.com:19020/heroku_jvgkqq7r',
    SECRET_TOKEN: 'SECRET123$TOKENQRVEY'
};