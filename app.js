require('dotenv').config();

const express = require('express');

const app = express();

const database = require('./model/database');
const auth = require('./model/auth');

database.connect();

//configurar resposta json
app.use(express.json());

//models
const user = require('./model/User');

//para registro de usuarios
app.post('/auth/register', async(req, res) => {
    const {nome, email, cpf,password, confirmPasswor} = req.body

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
})

app.get('/', (req, res) => {
    res.status(200).json({msg: 'bem vindo'});
})

app.listen(process.env.PORT, () => {
    console.log("servidor iniciado");
});

/*app.post('./login', (req, res)=> {
    const dadosUsuario = {
        _id: ''
    }

    const token = auth.geradorDeTokens(dadosUsuario);
    res.json({ token })
})*/
