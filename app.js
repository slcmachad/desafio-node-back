require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const database = require('./model/database');
const auth = require('./model/auth');

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

// Registro de usuários
app.post('/auth/register', auth.registerUser);

// Login de usuários
app.post('/auth/login', auth.loginUser);

app.listen(process.env.PORT, () => {
  console.log("Servidor iniciado");
});