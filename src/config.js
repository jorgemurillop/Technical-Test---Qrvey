// exportar configuraciones
// si la base no existe la crea
module.exports = {
    port: process.env.port || 3000,
    db: process.env.mongodb || 'mongodb://localhost:27017/wsQrvey',
    SECRET_TOKEN: 'SECRET123$TOKENQRVEY'
};