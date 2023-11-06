const express = require('express');
const router = express.Router();
const auth = require('../model/auth');

router.get('/turmas', auth.checkToken, auth.checkRole('ALUNO'), async (req, res) => {
    // logica para ver as turmas disponiveis para alunos se matricularem com os horarios;
    //verifica no banco de dados as turmas disponiveis
})

router.post('/matricular', auth.checkToken, auth.checkRole('ALUNO'), async (req, res) => {
    // logica para se matricular na turma
})