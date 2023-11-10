const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('./User');
const auth = require('../authenticators/auth');

// TO DO
// Usar ativo para o filtro dos GET
// Fazer rota de update da disciplina



const Disciplina = mongoose.model('Disciplina', {
    nome: String,
    idioma: {
        type: String,
        enum: ['Inglês', 'Espanhol'] // é possivel adicionar caso nescessario;
    },
    descricao: String, // dizer tipo Ingles I ou espanho Avançado
    ativo: {
        type: Boolean
    }
})

function checkProfessorRole(req, res, next) {
    if (req.user && req.user.role === 'PROFESSOR') {
            next();
    } else {
            res.status(403).json({ msg: 'Acesso negado, somente professores podem acessar a página' });
    }
}

router.get('/disciplinas', auth.checkToken, checkProfessorRole, async (req, res) => {
    try {
            const disciplinas = await Disciplina.find({});
             res.status(200).json({ disciplinas });
    } catch (erro) {
            console.error(erro);
            res.status(500).json({msg: 'Houve um problema ao buscar as disciplinas'})
    }
});

router.get('/minhaDisciplinas', auth.checkToken, checkProfessorRole, async (req, res) => {
    try{
            const professorId = req.user.id;

            const turmas = await Turma.find({professor: professorId});
            const disciplinas = turmas.map((turma) => {
                return turma.disciplina;
              });

            if(disciplinas.length === 0){
                    return res.redirect('/disciplinas');
            }

            res.status(200).json({disciplinas});
    }catch(erro){
            console.error(erro);
            res.status(500).json({msg: 'Houve um problema ao carregar as disciplinas'})
    }
});

router.post('/criarDisciplinas', auth.checkToken, checkProfessorRole, async (req, res) => {
    try{
            //criando o json para a disciplina
            const {nome, idioma, descricao} = req.body;

            //validando nome
            if(req.body.nome === null || req.body.nome === undefined || req.body.nome === '' || req.body.nome.length < 3){
                return res.status(400).json({msg: 'Nome da disciplina precisa ter ao menos 3 caracteres'});
            }

            //validando se já existe disciplina com mesmo nome e idioma
            const disciplinaExistente = await Disciplina.findOne({nome, idioma});
            if(disciplinaExistente){
            return res.status(400).json({msg: 'Já existe uma disciplina com esse nome e idioma'});
            }

            //validando idioma
            if(!['Inglês', 'Espanhol'].includes(idioma)){
                    return res.status(400).json({msg: 'Idioma inválido. Deve ser Inglês ou Espanhol'});
            }

            //validando descricao
            if(req.body.descricao === null || req.body.descricao === undefined || req.body.descricao === '' || req.body.descricao.length < 3){
                    return res.status(400).json({msg: 'Descrição da disciplina precisa ter ao menos 3 caracteres'});
            }

            //criando a disciplina e salvando no db
            const disciplina = new Disciplina({
                    nome, 
                    idioma, 
                    descricao
            });
            
            await disciplina.save();
            res.status(201).json({msg: "Disciplina criada com sucesso."});
    }catch(erro){
            console.error(erro);
            res.status(500).json({msg: "Houve um problema ao criar a disciplina"});
    }
});

module.exports = router;

