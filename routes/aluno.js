const express = require('express');
const router = express.Router();
const auth = require('../model/auth');

router.get('/classes', auth.checkToken, auth.checkRole('ALUNO'), async (req, res) => {
    // logica para ver as turmas disponiveis para alunos se matricularem com os horarios;
    //verifica no banco de dados as turmas disponiveis
    res.status(200).json({ msg: 'Bem-vindo' });
})

router.post('/matricular', auth.checkToken, auth.checkRole('ALUNO'), async (req, res) => {
    // logica para se matricular na turma
    res.status(200).json({ msg: 'Bem-vindo' });
})

module.exports = router;