const mongoose = require('mongoose');

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const connect = async () => {
    try{
        await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.ocskmtn.mongodb.net/?retryWrites=true&w=majority`,{
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