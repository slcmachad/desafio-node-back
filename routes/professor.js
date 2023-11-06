const express = require('express');
const router = express.Router();
const auth = require('../model/auth');

router.get('/turmas', auth.checkToken, auth.checkRole('PROFESSOR'), async (req, res) => {
        //tem que colocar a logica para visualizar a turma disponivel
        res.status(200).json({ msg: 'Bem-vindo' });
})

router.post('/criarTurmas', auth.checkToken, auth.checkRole('PROFESSOR'), async (req, res) => {
        //tem que colocar a logica para criar turma
        res.status(200).json({ msg: 'Bem-vindo' });
})

module.exports = router;