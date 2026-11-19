require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const recintosRouter = require('./routes/recintos');
const eventosRouter = require('./routes/eventos.js');

const app = express();
app.use(express.json());
const PORT = 27017;

app.use(express.json());
app.use(recintosRouter);
app.use(eventosRouter);

const URL_BD = process.env.URL_BD;

async function iniciarServidor() {
    try {
        await mongoose.connect(URL_BD);

        console.log('Conectado a MongoDB correctamente');

        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.log('Error conectando a MongoDB:', error);
    }
}

iniciarServidor();