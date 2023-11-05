const mongoose = require('mongoose');
const User = mongoose.model("User", {
    nome: String,
    email: String,
    cpf: String,
    password: String
})

module.exports = User