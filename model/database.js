const mongoose = require('mongoose');

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
// const dbHost = process.env.DB_HOST;
// const dbName = process.env.DB_NAME;

const connect = async () => {
    try{
        await mongoose.connect(``,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('conectado com o db');
    }catch(erro){
        console.error('Erro ao conectar com o banco', erro);
    }
};

module.exports = {
    connect
};