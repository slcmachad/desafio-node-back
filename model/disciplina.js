const mongoose = require('mongoose');

const Disciplina = mongoose.model('Disciplina', {
    nome: String,
    idioma: {
        type: String,
        enum: ['Inglês', 'Espanhol'] // é possivel adicionar caso nescessario;
    },
    descricao: String // dizer tipo Ingles I ou espanho Avançado
})

module.exports = Disciplina;    