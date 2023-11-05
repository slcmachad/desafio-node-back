const mongoose = require('mongoose');

const disciplinasTabela = new mongoose.Schema({
    nome: String,
    idioma: String
})

module.exports = mongoose.model('Disciplina',  disciplinasTabela);