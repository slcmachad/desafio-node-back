const express = require('express');
const router = express.Router();
const auth = require('../model/auth');

router.get('/turmas', auth.checkToken, auth.checkRole('PROFESSOR'), async (req, res) => {
        //tem que colocar a logica para visualizar a turma disponivel
})

router.post('/criarTurmas', auth.checkToken, auth.checkRole('PROFESSOR'), async (req, res) => {
        //tem que colocar a logica para criar turma
})

module.exports = router;