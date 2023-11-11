const mongoose = require('mongoose');

const horariosTabela = new mongoose.Schema({
    turno: {
        type: String,
        enum: ['manha', 'tarde'],
    },
    dias: {
        type: String,
        enum: ['segunda', 'quarta', 'sexta'],
    },
})

module.exports = mongoose.model('Horario', horariosTabela);