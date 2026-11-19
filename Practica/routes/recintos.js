const express = require('express');
const Recinto = require('../models/recinto.js');

let router = express.Router();

router.get('/recintos', (req, res) => {
    Recinto.find().then(resultado => {
        res.status(200)
            .send( { ok: true, resultado: resultado } );
    }).catch(error => {
        res.status(500) 
            .send( { ok: false, error: "No se han encontrado recintos" } );
    })
});

router.get('/recintos/:id', (req, res) => {
    Recinto.findById(req.params.id).then(resultado => {
        res.status(200)
            .send( { ok: true, resultado: resultado } );
    }).catch(error => {
        res.status(404)
            .send( { ok: false, error: `Recinto ${req.param.id} no encontrado` } );
    })
});

router.get('/recintos/localidad/:nombre', (req,res) => {
    Recinto.find( {nombre: req.params.nombre} ).then(resultado => {
        res.status(200)
            .send( { ok: true, resultado: resultado } );
    }).catch(error => {
        res.status(404)
            .send( { ok: false, error: "No se han encontrado recintos de la localidad indicada"} );
    })
});

router.post('/recinto', (req,res) => {
    let nuevoRecinto = new Recinto({
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        localidad: req.body.localidad,
        aforoMaximo: req.body.aforoMaximo
    });

    nuevoRecinto.save().then(resultado => {
        res.status(201)
            .send( { ok: true, resultado: resultado } );
    }).catch(error => {
        res.status(500)
            .send( {ok: false, error: "Error añadiendo recinto"});
    });
});

router.delete('/recintos/:id', (req,res) => {
    Recinto.findByIdAndDelete(req.params.id).then(resultado => {
        res.status(200)
            .send( { ok: true, resultado: resultado} )
    }).catch(error => {
        res.status(404)
            .send( { ok: false, error: `Error eliminando recinto ${req.param.id}`});
    });
});

module.exports = router;