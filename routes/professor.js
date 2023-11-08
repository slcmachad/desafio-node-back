const express = require('express');
const router = express.Router();
const auth = require('../model/auth');

function checkProfessorRole(req, res, next) {
        if (req.user && req.user.role === 'PROFESSOR') {
                next();
        } else {
                res.status(403).json({ msg: 'Acesso negado, somente professores podem acessar a página' });
        }
}
router.get('/turmas', auth.checkToken, checkProfessorRole, async (req, res) => {
        // Lógica para professores verem as turmas disponíveis
        // ...
        res.status(200).json({ msg: 'Bem-vindo, professor' });
});

router.post('/criarTurmas', auth.checkToken, checkProfessorRole, async (req, res) => {
        // Lógica para professores criarem turmas
        // ...
        res.status(200).json({ msg: 'Turma criada com sucesso' });
});

module.exports = router