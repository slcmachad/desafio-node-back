const express = require('express');
const router = express.Router();
const auth = require('../authenticators/auth');
const Turma = require('./turma');
const User = require('./User');


const checkAlunoAdminRole = (req, res, next) => {
  if (req.user && (req.user.role === 'ALUNO' || req.user.role === 'ADMIN')) {
      next();
  } else {
      res.status(403).json({ msg: 'Acesso negado, somente alunos ou administradores podem acessar a página' });
  }
};

router.get('/turmas', auth.checkToken, checkAlunoAdminRole, async (req, res) => {
  try {
          const turmas = await Turma.find({});
          res.status(200).json({turmas});
  } catch (erro) {
          console.error(erro);
          res.status(500).json({msg: 'Houve um problema ao buscar as turmas'})
  }
});

router.get('/turmasDisponiveis', auth.checkToken, checkAlunoAdminRole, async (req, res) => {
  try {
    // Busque todas as turmas
    const turmas = await Turma.find({});

    // Filtre as turmas disponíveis
    const turmasDisponiveis = turmas.filter((turma) => {
      return turma.capacidade > turma.alunosIds.length;
    });

    // Retorne a lista de turmas disponíveis
    res.status(200).json({ turmasDisponiveis });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ msg: 'Houve um problema ao buscar as turmas disponíveis' });
  }
});

router.get('/turmasMatriculadas/:id', auth.checkToken, checkAlunoAdminRole, async (req, res) => {
  const turmas = await Turma.find({
    alunosIds: { $in: [req.user.id] }
  });

  res.status(200).json({ turmas });
});

// Matrícula
router.post('/matricular/:id', auth.checkToken, checkAlunoAdminRole, async (req, res) => {
  const idTurma = req.params.id;
  const idAluno = req.user.id;

  try {
    const turma = await Turma.findById(idTurma);

    if (turma.alunosIds.includes(idAluno)) {
      turma.alunosIds = turma.alunosIds.filter((alunosId) => alunosId !== idAluno);
      await turma.save();
      res.status(200).json({ msg: 'Aluno desmatriculado com sucesso. Matrícula realizada em seguida.' });
    } else {
      const lotacao = turma.capacidade - turma.alunosIds.length;

      if (lotacao > 0) {
        turma.alunosIds.push(idAluno);
        await turma.save();
        res.status(200).json({ msg: 'Matrícula realizada com sucesso' });
      } else {
        res.status(500).json({ msg: 'Turma sem vaga disponível' });
      }
    }
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ msg: 'Houve um problema ao processar a matrícula' });
  }
});

  // Atualiza um aluno
router.patch('/:id',auth.checkToken, checkAlunoAdminRole, async (req, res) => {

  const id = req.params.id

  const {nome, email, cpf} = req.body

  const aluno = {
      nome,
      email,
      cpf
  }

  try {

      const updatedAluno = await User.updateOne({_id: id}, aluno)

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
router.delete('/:id',auth.checkToken, checkAlunoAdminRole, async(req,res)=> {
  const id = req.params.id
  
  const aluno = await User.findOne({_id: id})
  
  if(!aluno){
    res.status(422).json({message: 'O aluno não foi encontrado! '})
    return
  }
  
  try {
    await User.deleteOne({_id: id})
    
    res.status(200).json({message: 'Aluno removido com sucesso!'})

  }catch(error){
      res.status(500).json({error: error})
    }
})

module.exports = router;