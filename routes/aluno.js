const express = require('express');
const router = express.Router();
const auth = require('../model/auth');

// Importe a função genérica de verificação de função do usuário
const checkUserRole = auth.checkUserRole;

// Verifique a função do usuário usando a função genérica
router.get('/turmas', auth.checkToken, checkUserRole('ALUNO'), async (req, res) => {
  // Lógica para alunos verem as turmas disponíveis
  // ...
  res.status(200).json({ msg: 'Bem-vindo, aluno' });
});

router.post('/matricular', auth.checkToken, checkUserRole('ALUNO'), async (req, res) => {
  // Lógica para alunos se matricularem em uma turma
  // ...
  res.status(200).json({ msg: 'Matrícula realizada com sucesso' });
});

module.exports = router;
