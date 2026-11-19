const mongoose = require('mongoose');
const Recinto = require('./recinto.js');

let entradasSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        minlength: 3
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    disponibles: {
        type: Number,
        required: true,
        min: 0
    },
});

let eventosSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5
    },
    fecha: {
        type: Date,
        required: true, 
    },
    entradas: {
        type: [entradasSchema]
    },
    recinto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recintos',
        required: true
    }
});

let Evento = mongoose.model('eventos', eventosSchema);  
module.exports = Evento;