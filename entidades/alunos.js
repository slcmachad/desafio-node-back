const mongoose = require('mongoose');

const alunoTabela = new mongoose.Schema({
  nome: String,
  email: String,
  cpf: string
  // Verificar se possui outros campos relevantes para o aluno(cara das tabelas)
});

module.exports = mongoose.model('Aluno', alunoTabela);