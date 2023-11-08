const mongoose = require('mongoose');

const Turma = mongoose.model('Turma', {
    horario: String, // turno (manha ou tarde);
    diaDaSemana: String,   // segunda, quarta e sexta (somos preguiçosos)
    capacidade: Number, // o maximo que terá de alunos(5)
    disciplina: String, // Aqui você pode armazenar o idioma da turma
    professor: String,  // Pode ser o ID ou outro identificador único do professor (pode auterar quando for criar o professor)
    alunos: Number, // Quantidade máxima de alunos (atual)
});

module.exports = Turma;
