const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

function geradorDeTokens(dadosUsuario){
    return jwt.sign({id: dadosUsuario._id}, secretKey, {expiresIn: '24h'});
}

function verificarToken(req, res, next){
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({message: "token não existente"});
    }
    jwt.verify(token, secretKey, (erro, dadosUsuario) => {
        if(erro){
            return res.status(403).json({message: 'Token invalido'});
        }

        req.dadosUsuario = dadosUsuario;
        next();
    })
}

module.exports = {
    geradorDeTokens,
    verificarToken
}