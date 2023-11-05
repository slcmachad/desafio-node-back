const mongoose = require('mongoose');

const horariosTabela = new mongoose.Schema({
    turno: String,
})

module.exports = mongoose.model('Horario', horariosTabela);