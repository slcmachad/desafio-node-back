require('dotenv').config();

const express = require('express');

const app = express();

const database = require('./authenticators/database');
const auth = require('./authenticators/auth');

// Models
const User = require('./model/User');

// Conexão com o banco de dados
database.connect();


// Configurar resposta JSON
app.use(express.json());

// Rotas públicas
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem-vindo' });
});


// Rotas privadas
app.get("/users/:id", auth.checkToken, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id, '-password');

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar usuário" });
  }
});


// arquivos de rotas
const alunosRotas = require('./model/aluno');
const professoresRotas = require('./model/professor');
const rotasAdm = require('./model/admin')

// const disciplinasRotas = require('./model/disciplina');
const { router: disciplinasRotas } = require('./model/disciplina');

//uso das rotas
app.use('/alunos', alunosRotas);
app.use('/professores', professoresRotas);
app.use('/disciplinas', disciplinasRotas);
app.use('/admin', rotasAdm);

// Registro de usuários
app.post('/register', auth.registerUser);


// Login de usuários
app.post('/login', auth.loginUser);


//porta de entrada e iniciando o servidor
app.listen(process.env.PORT, () => {
  console.log("Servidor iniciado");
})