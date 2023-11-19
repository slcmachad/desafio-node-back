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

    // Verificar se req.user está definido
    if (!decoded || !decoded.role) {
      return res.status(401).json({ msg: "Acesso negado, token inválido" });
    }
    
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

  const camposObrigatorios = [
    { campo: nome, msg: "O nome é obrigatório" },
    { campo: email, msg: "O email é obrigatório" },
    { campo: cpf, msg: "O cpf é obrigatório" },
    { campo: password, msg: "A senha é obrigatória" },
  ];
  
  for (const campo of camposObrigatorios) {
    if (!campo.campo) {
      return res.status(422).json({ msg: campo.msg });
    }
  }
  
  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "As senhas devem ser idênticas" });
  }
  

  // Verificar se já existe um usuário com o mesmo CPF ou email
  const userExists = await User.findOne({ cpf: cpf});
  const userExiste = await User.findOne({ email: email });

  if (userExists || userExiste) {
    return res.status(422).json({ msg: "Usuário já cadastrado com esse CPF ou EMAIL" });
  }

  // Criar a senha
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Criar usuário com role ALUNO
  const user = new User({
    nome,
    email,
    cpf,
    password: passwordHash,
    role: 'ALUNO'
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuário ALUNO cadastrado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Houve um problema, por favor, tente novamente em alguns minutos" });
  }
}

// Função para registrar professores (requer ADMIN)
async function registerProfessor(req, res) {
  const { nome, email, cpf, password, confirmPassword, role } = req.body;

  // Validações
  const camposObrigatorios = [
    { campo: nome, msg: "O nome é obrigatório" },
    { campo: email, msg: "O email é obrigatório" },
    { campo: cpf, msg: "O cpf é obrigatório" },
    { campo: password, msg: "A senha é obrigatória" },
    { campo: confirmPassword, msg: "A confirmação de senha é obrigatória" },
    { campo: role, msg: "A role é obrigatória" },
  ];

  for (const campo of camposObrigatorios) {
    if (!campo.campo) {
      return res.status(422).json({ msg: campo.msg });
    }
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "As senhas devem ser idênticas" });
  }

  // Verificar se o usuário logado tem a role de ADMIN
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ msg: 'Acesso negado, somente administradores podem acessar esta função' });
  }

  // Verificar se já existe um usuário com o mesmo CPF ou email
  const userExists = await User.findOne({ cpf, email });

  if (userExists) {
    return res.status(422).json({ msg: "Usuário já cadastrado com esse CPF ou email" });
  }

  // Criar a senha
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Criar usuário com a role especificada
  const user = new User({
    nome,
    email,
    cpf,
    password: passwordHash,
    role
  });

  try {
    await user.save();
    res.status(201).json({ msg: `Usuário ${role} cadastrado com sucesso` });
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
    const id = user._id;
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({ msg: "Autenticado com sucesso", token, id});


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
  registerProfessor
};