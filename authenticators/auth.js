const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');


//função para validar o token
function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado (deve estar hackeando)" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
}

//função para registrar o ususario
async function registerUser(req, res) {
  const { nome, email, cpf, password, confirmPassword } = req.body;

  // Validações

  if (!nome) {
    return res.status(422).json({ msg: "O nome é obrigatório" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório" });
  }
  if (!cpf) {
    return res.status(422).json({ msg: "O cpf é obrigatório" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória" });
  }
  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "As senhas devem ser idênticas" });
  }

  // Verificar se já existe um usuário com o mesmo CPF
  const userExists = await User.findOne({ cpf: cpf });

  if (userExists) {
    return res.status(422).json({ msg: "Usuário já cadastrado com esse CPF" });
  }

  // Criar a senha
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const role = req.body.role || '';

  // Criar usuário
  const user = new User({
    nome,
    email,
    cpf,
    password: passwordHash,
    role: role
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário cadastrado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Houve um problema, por favor, tente novamente em alguns minutos" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(422).json({ msg: "O email e a senha são obrigatórios" });
  }

  try {
    // Verificar se o usuário com o email fornecido existe
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    // Verificar se as senhas são compatíveis
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida" });
    }

    // Gerar o token JWT
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id, role: user.role }, secret);;

    // Redirecionar o usuário para a rota principal (por exemplo, '/home')
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({ msg: "Autenticado com sucesso", token });


    //return res.redirect('/home?role=' + user.role);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Houve um problema, por favor, tente novamente em alguns minutos" });
  }
}

module.exports = {
  checkToken,
  registerUser,
  loginUser,
};