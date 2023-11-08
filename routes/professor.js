const express = require('express');
const router = express.Router();
const auth = require('../model/auth');

// Importe a função genérica de verificação de função do usuário
const checkUserRole = auth.checkUserRole;

// Verifique a função do usuário usando a função genérica
router.get('/classes', auth.checkToken, checkUserRole('PROFESSOR'), async (req, res) => {
  // Lógica para professores verem as turmas disponíveis
  // ...
  res.status(200).json({ msg: 'Bem-vindo, professor' });
});

router.post('/criarTurmas', auth.checkToken, checkUserRole('PROFESSOR'), async (req, res) => {
  // Lógica para professores criarem turmas
  // ...
  res.status(200).json({ msg: 'Turma criada com sucesso' });
});

module.exports = router;
