const mongoose = require('mongoose');

const turmaTabela = new mongoose.Schema({
    horario: String,
    diaDaSemana: String,
    capacidade: Number,
    disciplina: {type: mongoose.Schema.Types.ObjectId, ref: 'Disciplina'},
    professor: {type: mongoose.Schema.Types.ObjectId, ref: 'Professor'},
    alunos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Aluno'}],
})

module.exports = mongoose.model('Turma', turmaTabela)