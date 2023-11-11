const express = require('express');
const router = express.Router();
const auth = require('../authenticators/auth');
const { checkToken } = require('./auth');

function checkAlunoRole(req, res, next) {
    if (req.user && req.user.role === 'ALUNO') {
        next(); // Permite o acesso se for um aluno
    } else {
        res.status(403).json({ msg: 'Acesso negado, somente alunos podem acessar a página' });
    }
}
// Ler as turmas
router.get('/turmas', auth.checkToken, checkAlunoRole, async (req, res) => {
  const turmas = await Turma.find();
  const turmasAutorizadas = turmas.filter(turma => turma.alunos.includes(req.user.id));
  res.status(200).json({ turmas: turmasAutorizadas });
});

// cadastro de alunos
router.post('/matricular', auth.checkToken, checkAlunoRole, async (req, res) => {
  const idTurma = req.body.idTurma;
  const idAluno = req.user.id;

  const turma = await Turma.findById(idTurma);

  const matricula = new Matricula({
    idTurma,
    idAluno
  });

  await matricula.save();

  res.status(200).json({ msg: 'Matrícula realizada com sucesso' });
});

// Criar aluno 
router.post('/', auth.checkToken, checkAlunoRole, async (req, res) => {
  // req.body
  const {nome, email, cpf} = req.body
  const aluno ={
    nome,
    email,
    cpf
  }
  try {
    await Aluno.create(aluno)

    res.status(201).json({message: 'Aluno criado com sucesso'})

    } catch(error){
        res.status(500).json({error: error})
    }
    })

     // Read - leitura de dados
  router.get('/', auth.checkToken, checkAlunoRole,  async (req,res) => {
    try {
          const aluno = await Aluno.find()

          res.status(200).json(aluno)
    }catch(error){
          res.status(500).json({error: error})
      }
  })

 // Busca um aluno pelo id
router.get('/:id',auth.checkToken, checkAlunoRole,  async (req, res) =>{
  // extraair o dado da requisição, pela url = req.params

  const id = req.params.id

  try {

      const aluno = await Aluno.findOne({_id: id})
      res.status(200).json(aluno)

  }catch(error){
      res.status(500).json({error: error})
  }
})
 
// Lista todos os alunos
router.get('/',auth.checkToken,checkAlunoRole,  async (req,res) => {
  try {
      const aluno = await Aluno.find()
      res.status(200).json(aluno)
  }catch(error){
      res.status(500).json({error: error})
  }
})

// Atualiza um aluno
router.patch('/:id',auth.checkToken, checkAlunoRole, async (req, res) => {

  const id = req.params.id

  const {nome, email, cpf} = req.body

  const aluno = {
      nome,
      email,
      cpf
  }

  try {

      const updatedAluno = await Aluno.updateOne({_id: id}, aluno)

      if(updatedAluno.matchedCount === 0){
          res.status(422).json({message: 'O usuário não foi encontrado!'})
          return
      }

      res.status(200).json(aluno)

  } catch(error){
      res.status(500).json({error: error})
  }
})

// Deleta um aluno
router.delete('/:id',auth.checkToken, checkAlunoRole, async(req,res)=> {
  const id = req.params.id
  
  const aluno = await Aluno.findOne({_id: id})
  
  if(!aluno){
    res.status(422).json({message: 'O aluno não foi encontrado! '})
    return
  }
  
  try {
    await Aluno.deleteOne({_id: id})
    
    res.status(200).json({message: 'Aluno removido com sucesso!'})

  }catch(error){
      res.status(500).json({error: error})
    }
})

module.exports = router;