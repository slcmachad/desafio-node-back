const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('./User');
const auth = require('../authenticators/auth');

// TO DO
// Usar ativo para o filtro dos GET
// Fazer rota de update da disciplina

const Disciplina = mongoose.model('Disciplina', {
        nome: {
          type: String,
          required: true,
        },
        idioma: {
          type: String,
          enum: ['Inglês', 'Espanhol'],
          required: true,
        },
        descricao: {
          type: String,
          required: true,
        },
        ativo: {
          type: Boolean,
          required: true,
          default: true,
        },
});

const checkProfessorRole = (req, res, next) => {
    if (req.user && req.user.role === 'PROFESSOR') {
        next();
    } else {
        res.status(403).json({ msg: 'Acesso negado, somente professores podem acessar a página' });
    }
};

router.get('/disciplinas', auth.checkToken, checkProfessorRole, async (req, res) => {
        try {
                const disciplinas = await Disciplina.find({
                        ativo: req.query.ativo ? req.query.ativo === 'true' ? true : false : true
                });
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
            
            const ativo = req.query.ativo ? true : undefined;
            const filtradas = disciplinas.filter((disciplina) => disciplina.ativo === ativo);

            res.status(200).json({disciplinas: filtradas});
    }catch(erro){
            console.error(erro);
            res.status(500).json({msg: 'Houve um problema ao carregar as disciplinas'})
    }
});

router.post('/criarDisciplinas', auth.checkToken, checkProfessorRole, async (req, res) => {
    try{
            //criando o json para a disciplina. Ela vai ser criada como ativa por default
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
            
            //salvando a disciplina e atribuindo o ID da disciplina à variável id
            let id = await disciplina.save();

            // res.status(201).json({msg: "Disciplina criada com sucesso."});
            res.status(201).json({
                msg: "Disciplina criada com sucesso.",
                id: id
            });
    }catch(erro){
            console.error(erro);
            res.status(500).json({msg: "Houve um problema ao criar a disciplina"});
    }
});

router.get('/disciplinas/:id', auth.checkToken, checkProfessorRole, async (req, res) => {
        try {
          const id = req.params.id;
          const disciplina = await Disciplina.findById(id);
      
          if (!disciplina) {
            return res.status(404).json({msg: 'Disciplina não encontrada'});
          }
      
        res.status(200).json(disciplina);

        } catch (erro) {
          console.error(erro);
          res.status(500).json({msg: 'Houve um problema ao buscar a disciplina'});
        }
});

router.put('/disciplinas/:id', auth.checkToken, checkProfessorRole, async (req, res) => {
        try {
            const id = req.params.id;
            let edicao = [];
            const disciplina = await Disciplina.findById(id);
    
            if (!disciplina) {
                return res.status(404).json({msg: 'Disciplina não encontrada'});
            }
    
            const {nome, idioma, descricao, ativo} = req.body;
    
            //validando nome
            if (req.body.nome) {
                if(req.body.nome !== disciplina.nome) {
                        edicao.push("Nome");
                }
                if (req.body.nome === null || req.body.nome === undefined || req.body.nome === '' || req.body.nome.length < 3) {
                        return res.status(400).json({msg: 'Nome da disciplina precisa ter ao menos 3 caracteres'});
                }
                
            }
    
            //validando se já existe disciplina com mesmo nome e idioma
            const disciplinaExistente = await Disciplina.findOne({nome, idioma});
            if (disciplinaExistente && disciplinaExistente.id !== id) {
                return res.status(400).json({msg: 'Já existe uma disciplina com esse nome e idioma'});
            }
    
            
            //validando idioma
            if (req.body.idioma) {
                if(req.body.idioma !== disciplina.idioma) {
                        edicao.push("Idioma");
                }
                if (!['Inglês', 'Espanhol'].includes(idioma)) {
                        return res.status(400).json({msg: 'Idioma inválido. Deve ser Inglês ou Espanhol'});
                }
            }

            //validando descricao
            if (req.body.descricao) {
                if(req.body.descricao !== disciplina.descricao) {
                        edicao.push("Descrição");
                }
                if (req.body.descricao === null || req.body.descricao === undefined || req.body.descricao === '' || req.body.descricao.length < 3) {
                        return res.status(400).json({msg: 'Descrição da disciplina precisa ter ao menos 3 caracteres'});
                }
            }

            if (req.body.ativo !== disciplina.ativo) {
                edicao.push("Status");
            }

    
            //atualizando os dados da disciplina
            disciplina.nome = nome ?? disciplina.nome;
            disciplina.idioma = idioma ?? disciplina.idioma;
            disciplina.descricao = descricao ?? disciplina.descricao;
            disciplina.ativo = ativo ?? disciplina.ativo;
    
            await disciplina.save();
            if (edicao.length === 0){
                res.status(200).json({msg: "Nenhuma informacao foi alterada"});
            } else {
                res.status(200).json({msg: "Disciplina atualizada com sucesso. Campo(s) alterado(s): " + edicao.join(",")});
            }
            
        } catch (erro) {
            console.error(erro);
            res.status(500).json({msg: "Houve um problema ao atualizar a disciplina"});
        }
});

module.exports = router