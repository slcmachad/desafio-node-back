const express = require('express');
const router = express.Router();
const auth = require('../authenticators/auth');
const Turma = require('./turma');
const { Disciplina} = require('./disciplina');

const checkProfessorAdminRole = (req, res, next) => {
        if (req.user && (req.user.role === 'PROFESSOR' || req.user.role === 'ADMIN')) {
            next();
        } else {
            res.status(403).json({ msg: 'Acesso negado, somente professores ou administradores podem acessar a página' });
        }
};

const checkProfessorRole = (req, res, next) => {
        if (req.user && (req.user.role === 'PROFESSOR')) {
            next();
        } else {
            res.status(403).json({ msg: 'Acesso negado, somente professores podem acessar a página' });
        }
};

router.get('/turmas', auth.checkToken, checkProfessorAdminRole, async (req, res) => {
        try {
                const turmas = await Turma.find({});
                res.status(200).json({turmas});
        } catch (erro) {
                console.error(erro);
                res.status(500).json({msg: 'Houve um problema ao buscar as turmas'})
        }
});

router.get('/minhaTurmas', auth.checkToken, checkProfessorRole, async (req, res) => {
        try{
                const professorId = req.user.id;

                const turmas = await Turma.find({professor: professorId});

                if(turmas.length === 0){
                        return res.redirect('/turmas');
                }

                res.status(200).json({ turmas});
        }catch(erro){
                console.error(erro);
                res.status(500).json({msg: 'Houve um problema ao carregar as turmas'})
        }
});

module.exports = router