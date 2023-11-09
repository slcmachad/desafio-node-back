const express = require('express');
const router = express.Router();
const auth = require('../authenticators/auth');
const Turma = require('./turma');
const User = require('./User');

function checkProfessorRole(req, res, next) {
        if (req.user && req.user.role === 'PROFESSOR') {
                next();
        } else {
                res.status(403).json({ msg: 'Acesso negado, somente professores podem acessar a página' });
        }
}
router.get('/turmas', auth.checkToken, checkProfessorRole, async (req, res) => {
        try {
                const turmas = await Turma.find({});
                res.status(200).json({turmas});
        } catch (erro) {
                console.error(erro);
                res.status(500).json({msg: 'Houve um problema ao buscar as turmas'})
        }
});

router.post('/criarTurmas', auth.checkToken, checkProfessorRole, async (req, res) => {
        try{
                //criando o json para a turma
                const {horario, diaDaSemana, capacidade, disciplina, professorId, alunos} = req.body;

                //validando horario e dia
                if(!['manha', 'tarde'].includes(horario)){
                        return res.status(400).json({msg: 'Horário inválido, somente pelas manhãs e tardes'});
                }

                if(!['segunda', 'quarta', 'sexta'].includes(diaDaSemana)){
                        return res.status(400).json({msg: 'Dia da semana inválido. Deve ser "segunda", "quarta" ou "sexta".'});
                }

                //verificando se existe já para esse professor
                const turmaExiste = await Turma.findOne({
                        diaDaSemana: diaDaSemana,
                        horario: horario,
                        professor: professorId
                })

                if(turmaExiste){
                        return res.status(400).json({msg: "Este professor Ja está ocupado neste dia e horário"});
                }
                //procurando professor
                const professor = await User.findById(professorId);

                if(!professor){
                        return res.status(404).json({msg: "Professor não encontrado"});
                }
                //criando a turma e salvando no db
                const turma = new Turma({horario, diaDaSemana, capacidade, disciplina, professor: professor._id, alunos});
                await turma.save();
                res.status(201).json({msg: "Turma criada com sucesso."});
        }catch(erro){
                console.error(erro);
                res.status(500).json({msg: "Houve um problema ao criar a turma"});
        }
});

module.exports = router