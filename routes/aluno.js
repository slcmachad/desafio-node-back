const express = require('express');
const router = express.Router();
const auth = require('../model/auth');

function checkAlunoRole(req, res, next) {
    if (req.user && req.user.role !== 'PROFESSOR' && req.user.role) {
        console.log(req.user.role);
            next();
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

module.exports = router;