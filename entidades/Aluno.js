// const router = require('express').Router()

// const Aluno = require('./Aluno')
// // Criação de dados - Create
// router.post('/', async (req, res) => {
//     // req.body
//     const {nome, email, cpf} = req.body

//     if(!nome) {
//         res.status(422).json(({error: 'O nome é obrigatorio'}))
//         return
//     }
    
//     if(!email) {
//       res.status(422).json(({error: 'O email é obrigatorio'}))
//       return
//     }
    
//     if(!cpf) {
//     res.status(422).json(({error: 'O cpf é obrigatorio'}))
//     return
//     }
    

//     const aluno ={
//       nome,
//       email,
//       cpf
//     }



// // Cria um novo aluno
//     // create
//     try {
//       await Aluno.create(aluno)
  
//       res.status(201).json({message: 'Aluno criado com sucesso'})
  
//       } catch(error){
//           res.status(500).json({error: error})
//       }
//       })
  
//       // Read - leitura de dados
  
//       router.get('/',  async (req,res) => {
//           try {
//               const aluno = await Aluno.find()
  
//               res.status(200).json(aluno)
//           }catch(error){
//               res.status(500).json({error: error})
//           }
//       })

// // Busca um aluno pelo id
// router.get('/:id',  async (req, res) =>{
//   // extraair o dado da requisição, pela url = req.params

//   const id = req.params.id

//   try {

//       const aluno = await Aluno.findOne({_id: id})

//       if(!person){
//           res.status(422).json({message: 'O user não foi encontrado'})
//           return
//       }

//       res.status(200).json(aluno)

//   }catch(error){
//       res.status(500).json({error: error})
//   }
// })

// // Lista todos os alunos
//   router.get('/',  async (req,res) => {
//     try {
//         const aluno = await Aluno.find()

//         res.status(200).json(aluno)
//     }catch(error){
//         res.status(500).json({error: error})
//     }
// })

// // Atualiza um aluno
// router.patch('/:id', async (req, res) => {

//   const id = req.params.id

//   const {nome, email, cpf} = req.body

//   const aluno = {
//       nome,
//       email,
//       cpf
//   }

//   try {

//       const updatedAluno = await Aluno.updateOne({_id: id}, aluno)

//       if(updatedAluno.matchedCount === 0){
//           res.status(422).json({message: 'O usuário não foi encontrado!'})
//           return
//       }

//       res.status(200).json(aluno)

//   } catch(error){
//       res.status(500).json({error: error})
//   }
// })


// // Deleta um aluno
// router.delete('/:id', async(req,res)=> {
//   const id = req.params.id
  
//   const aluno = await Aluno.findOne({_id: id})
  
//   if(!aluno){
//     res.status(422).json({message: 'O aluno não foi encontrado! '})
//     return
//   }
  
//   try {
//     await Aluno.deleteOne({_id: id})
    
//     res.status(200).json({message: 'Aluno removido com sucesso!'})

//   }catch(error){
//       res.status(500).json({error: error})
//     }
// })
    
// module.exports = router;