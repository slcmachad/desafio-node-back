const mongoose = require('mongoose');

const professorTabela = new mongoose.Schema({
    nome: String,
    email: String,
    cpf: string,
    materia: string
})

module.exports = mongoose.model('Professor', professorTabela);
