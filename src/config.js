
// exportar configuraciones
// si la base no existe la crea
if (!process.env.SECRET_TOKEN && process.env.NODE_ENV === 'production') {
    throw new Error('Falta la variable de entorno SECRET_TOKEN (obligatoria en producción)');
}

module.exports = {
    PORT: process.env.PORT || 3000,
    DB: process.env.MONGODB || 'mongodb://127.0.0.1:27017/qrvey_dev',
    SECRET_TOKEN: process.env.SECRET_TOKEN || 'dev-only-secret-cambiar-en-produccion',
    ENV: process.env.NODE_ENV || 'test'
};
