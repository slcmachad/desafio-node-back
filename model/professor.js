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

router.put('/atualizarTurma/:id', auth.checkToken, checkProfessorAdminRole, async(req, res) => {
        try {
                const turmaId = req.params.id;
                const { horario, capacidade, disciplinaId } = req.body;
        
                // Validar se a turma com o ID fornecido existe
                const turmaExistente = await Turma.findById(turmaId);
        
                if (!turmaExistente) {
                    return res.status(404).json({ msg: 'Turma não encontrada' });
                }

                const disciplina = await Disciplina.findOne({ _id: disciplinaId });

                if (!disciplina) {
                return res.status(404).json({ msg: 'Disciplina não encontrada' });
                }
        
                // Atualizar os campos da turma
                turmaExistente.horario = horario;
                turmaExistente.capacidade = capacidade;
                turmaExistente.disciplina = disciplinaId;
        
                // Salvar a turma atualizada no banco de dados
                await turmaExistente.save();
        
                // Retornar o objeto turmaExistente atualizado
                res.status(200).json({ msg: 'Turma atualizada com sucesso', turma: turmaExistente });
        } catch(erro){
                console.error(erro);
                res.status(500).json({ msg: 'Houve um problema ao atualizar a turma' });
        }
})

module.exports = router