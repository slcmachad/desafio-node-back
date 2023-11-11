const express = require('express');
const router = express.Router();
const auth = require('../authenticators/auth');

function checkAlunoRole(req, res, next) {
    if (req.user && req.user.role === 'ALUNO') {
        next(); // Permite o acesso se for um aluno
    } else {
        res.status(403).json({ msg: 'Acesso negado, somente alunos podem acessar a página' });
    }
}

router.get('/turmas', auth.checkToken, checkAlunoRole, async (req, res) => {
  // Lógica para alunos verem as turmas disponíveis
  // ...

  res.status(200).json({ msg: 'Bem-vindo, aluno' });
});

router.post('/matricular', auth.checkToken, checkAlunoRole, async (req, res) => {
  // Lógica para alunos se matricularem em uma turma
  // ...
  res.status(200).json({ msg: 'Matrícula realizada com sucesso' });
});

router.delete('/:id')

module.exports = router;