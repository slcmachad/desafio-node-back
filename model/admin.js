const express = require('express');
const router = express.Router();
const auth = require('../authenticators/auth');
const Turma = require('./turma');
const { Disciplina } = require('./disciplina');
const User = require('./User');


const checkAdminRole = (req, res, next) => {
    if (req.user && (req.user.role === 'ADMIN')) {
        next();
    } else {
        res.status(403).json({ msg: 'Acesso negado, somente administradores podem acessar a página' });
    }
};

router.get('/turmas', auth.checkToken, checkAdminRole, async (req, res) => {
    try {
            const turmas = await Turma.find({});
            res.status(200).json({turmas});
    } catch (erro) {
            console.error(erro);
            res.status(500).json({msg: 'Houve um problema ao buscar as turmas'})
    }
});

router.post('/criarTurmas', auth.checkToken, checkAdminRole, async (req, res) => {
    try{
            //criando o json para a turma
            const {horario, diaDaSemana, capacidade, disciplinaId, professorId} = req.body;

            //validando horario e dia
            if(!['manha', 'tarde'].includes(horario)){
                    return res.status(400).json({msg: 'Horário inválido, somente pelas manhãs e tardes'});
            }

            if(!['segunda', 'quarta', 'sexta'].includes(diaDaSemana)){
                    return res.status(400).json({msg: 'Dia da semana inválido. Deve ser "segunda", "quarta" ou "sexta".'});
            }

            //validando capacidade
            if(typeof capacidade !== 'number' || capacidade <= 0 || capacidade > 10){
                    return res.status(400).json({msg: "A capacidade deve ser um numero positivo, e não deve ter mais de 10 alunos"});
            }

            //validando as disciplinas:
            const disciplina = await Disciplina.findOne({ _id: disciplinaId });

            if (!disciplina) {
               return res.status(404).json({ msg: 'Disciplina não encontrada' });
            }

            const alunos = [];

            //procurando professor
            const professor = await User.findById(professorId);
            
            if(!professor){
                    return res.status(404).json({msg: "Professor não encontrado"});
            }

            //verificando a turma se existe já para esse professor
            const turmaExiste = await Turma.findOne({
                    diaDaSemana: diaDaSemana,
                    horario: horario,
                    professor: professorId
            })

            if(turmaExiste){
                    return res.status(400).json({msg: "Este professor Ja está ocupado neste dia e horário"});
            }

            //criando a turma e salvando no db
            const turma = new Turma({
                    horario, 
                    diaDaSemana, 
                    capacidade, 
                    disciplina: disciplinaId, 
                    professor: professor._id, 
                    alunos
            });
            
            await turma.save();
            res.status(201).json({msg: "Turma criada com sucesso."});
    }catch(erro){
            console.error(erro);
            res.status(500).json({msg: "Houve um problema ao criar a turma"});
    }
});

router.put('/atualizarTurma/:id', auth.checkToken, checkAdminRole, async (req, res) => {
    try {
        const turmaId = req.params.id;
        const { horario, diaDaSemana, capacidade, disciplinaId, professorId, alunos } = req.body;

        // Validar se a turma com o ID fornecido existe
        const turmaExistente = await Turma.findById(turmaId);

        if (!turmaExistente) {
            return res.status(404).json({ msg: 'Turma não encontrada' });
        }

        //validando as disciplinas:
        const disciplina = await Disciplina.findOne({ _id: disciplinaId });

        if (!disciplina) {
           return res.status(404).json({ msg: 'Disciplina não encontrada' });
        }

        //procurando professor
        const professor = await User.findById(professorId);
        
        if(!professor){
                return res.status(404).json({msg: "Professor não encontrado"});
        }

        // Atualizar todos os campos da turma, incluindo o professor
        turmaExistente.horario = horario;
        turmaExistente.diaDaSemana = diaDaSemana;
        turmaExistente.capacidade = capacidade;
        turmaExistente.disciplina = disciplinaId;
        turmaExistente.professor = professorId;
        turmaExistente.alunos = alunos;

        // Salvar a turma atualizada no banco de dados
        await turmaExistente.save();

        // Retornar o objeto turmaExistente atualizado
        res.status(200).json({ msg: 'Turma atualizada com sucesso', turma: turmaExistente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Houve um problema ao atualizar a turma' });
    }
});

router.delete('/excluirTurma/:id', auth.checkToken, checkAdminRole, async (req, res) => {
    try {
        const turmaId = req.params.id;

        // Validar se a turma com o ID fornecido existe
        const turmaExistente = await Turma.findById(turmaId);

        if (!turmaExistente) {
            return res.status(404).json({ msg: 'Turma não encontrada' });
        }

        // Remover a turma do banco de dados
        await Turma.deleteOne({ _id: turmaId });

        res.status(200).json({ msg: 'Turma excluída com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Houve um problema ao excluir a turma' });
    }
});

router.post('/registrarProfessor', auth.checkToken, checkAdminRole, auth.registerProfessor);

module.exports = router;