const mongoose = require('mongoose');

const turmaTabela = new mongoose.Schema({
    horario: String,
    diaDaSemana: String,
    capacidade: Number,
    professor: {type: mongoose.Schema.Types.ObjectId, ref: 'Professor'},
    disciplina: {type: mongoose.Schema.Types.ObjectId, ref: 'Disciplina'},
    alunos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Aluno'}],
})

module.exports = mongoose.model('Turma', turmaTabela)