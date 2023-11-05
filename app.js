require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

const database = require('./model/database');
//const auth = require('./model/auth');

//models
const User = require('./model/User');

//conecção com banco de dados
database.connect();

//configurar resposta json
app.use(express.json());

//rotas publicas
app.get('/', (req, res) => {
    res.status(200).json({msg: 'bem vindo'});
})

//rotas privadas
app.get("/users/:id", checkToken, async (req, res) => {
    const id = req.params.id

    //checar se tem esse usuario

    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({msg: "Usuário não encontrado"})
    }

    res.status(200).json({ user })

})

function checkToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({msg: "Acesso negado(deve ta de hack)"})
    }

    try {
        const secret = process.env.JWT_SECRET;

        jwt.verify(token, secret);

        next();
    } catch (error) {
        res.status(400).json({msg: "Token inválido"})
    }
}

//para registro de usuarios
app.post('/auth/register', async(req, res) => {
    const {nome, email, cpf,password, confirmPassword} = req.body

    //validações

    if(!nome){
        return res.status(422).json({msg: "O nome é obrigatório"});
    }
    if(!email){
        return res.status(422).json({msg: "O email é obrigatório"});
    }
    if(!cpf){
        return res.status(422).json({msg: "O cpf é obrigatório"});
    }
    if(!password){
        return res.status(422).json({msg: "A senha é obrigatória"});
    }
    if(password !== confirmPassword){
        return res.status(422).json({msg: "As senhas devem ser identicas"});
    }

    //checar se já existe usuario

    const userExists = await User.findOne({cpf: cpf})

    if(userExists){
        return res.status(422).json({msg: "Usuário já cadastrado com esse cpf"});
    }

    // Criar a senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt)

    // Criar usuario
    const user = new User({
        nome,
        email,
        cpf,
        password: passwordHash,
    })

    try{
        await user.save();
        res.status(201).json({msg: "funciona please"});
    }catch(erro){
        console.log(erro);
        res.status(500).json({msg: "Houve um problema, por favor tente novamente em alguns minutos"})
    }

})

// login user

app.post('/auth/login', async(req, res) => {
    const {email, password} = req.body;

    if(!email){
        return res.status(422).json({msg: "O email é obrigatório"});
    }
    
    if(!password){
        return res.status(422).json({msg: "A senha é obrigatória"});
    }

    //verificar se já tem usuario

    const user = await User.findOne({email: email})

    if(!user){
        return res.status(404).json({msg: "Usuário Não encontrado"});
    }

    //verificar se senhas são compativeis(se ele não ta de hack)
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({msg: "Senha inválida"});
    }

    try{
        const secret = process.env.JWT_SECRET;
        
        const token = jwt.sign({
            id: user._id
        }, secret)

        res.status(200).json({msg: "autenticado com sucesso", token})

    }catch(erro){
        console.log(erro);
        res.status(500).json({msg: "Houve um problema, por favor tente novamente em alguns minutos"})
    }
})



app.listen(process.env.PORT, () => {
    console.log("servidor iniciado");
});


