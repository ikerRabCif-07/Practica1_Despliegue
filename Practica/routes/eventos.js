const express = require('express');
const Evento = require('../models/evento.js');

let router = express.Router();

router.get('/eventos', (req,res) => {
    Evento.find().populate('recinto').then(resultado => {
        res.status(200)
            .send( { ok: true, resultado: resultado } );
    }).catch(error => {
        res.status(404)
            .send( { ok: false, error: "No se han encontrado eventos" } );
    });
});

router.get('/evento/:id', (req, res) => {
    Evento.findById(req.params.id).populate('recinto').then(resultado => {
        res.status(200)
            .send( { ok: true, resultado: resultado } )
    }).catch(error => {
        res.status(404)
            .send( { ok: false, error: `Evento ${req.params.id} no encontrado`} );
    });
});

router.get('/evento/localidad/:nombre', (req,res) => {
    let date = new Date().now;
    Evento.find( {localidad: req.params.nombre} ).then(resultado => {
        if(resultado.fecha >= date) {
            res.status(200)
            .send( { ok: true, resultado: resultado } );
        }
    }).catch(error => {
        res.status(404)
            .send( { ok: false, error: "No se han encontrado eventos" } );
    });
});

router.post('/evento', (req,res) => {
    let fecha = new Date.now()
    let nuevoEvento = new Evento({
        nombre: req.body.nombre,
        fecha: fecha,
        entradas: req.body.entradas,
        recinto: req.body.recinto
    });

    nuevoEvento.save().then(resultado => {
        res.status(201)
            .send( { ok: true, resultado: resultado } );
    }).catch(error => {
        res.status(500)
            .send( { ok: false, error: "Error añadiendo evento"} );
    });
});

router.put('/eventos/:id', (req,res) => {
    Evento.UpdateById(req.params.id).then(resultado => {
        res.status(200)
            .send( { ok: true, resultado: resultado } );
    }).catch(errror => {
        res.status(404)
            .send( { ok:false, error: `Error actualizando evento ${req.params.id}`} );
    });
});

router.delete('/eventos/:id', (req,res) => {
    Evento.DeleteById(req.params.id).then(resultado => {
        res.status(200)
            .send( { ok: true, resultado: resultado } );
    }).catch(errror => {
        res.status(404)
            .send( { ok:false, error: `Error eliminando evento ${req.params.id}`} );
    });
});

// Endpoints específicos //

router.get('/eventos/entradas/:idEvento/:tipoEntrada', (req, res) => {

    const { idEvento, tipoEntrada } = req.params;

    Evento.findById(idEvento)
        .then(evento => {

            if (!evento) {
                return res.status(404).json({
                    error: `Error obteniendo datos de entrada para evento ${idEvento}`
                });
            }

            const entrada = evento.entradas.find(
                e => e.tipo === tipoEntrada
            );

            if (!entrada) {
                return res.status(404).json({
                    error: `Error obteniendo datos de entrada para evento ${idEvento}`
                });
            }

            res.status(200).json({
                resultado: {
                    precio: entrada.precio,
                    disponibles: entrada.disponibles
                }
            });

        })
        .catch(() => {
            res.status(404).json({
                error: `Error obteniendo datos de entrada para evento ${idEvento}`
            });
        });

});

router.put('/eventos/entradas/:idEvento/:tipoEntrada/:cantidad', (req, res) => {

    const { idEvento, tipoEntrada, cantidad } = req.params;

    Evento.findById(idEvento)
        .then(evento => {

            if (!evento) {
                throw new Error();
            }

            const entrada = evento.entradas.find(
                e => e.tipo === tipoEntrada
            );

            if (!entrada || entrada.disponibles < Number(cantidad)) {
                throw new Error();
            }

            entrada.disponibles -= Number(cantidad);

            return evento.save();
        })
        .then(eventoActualizado => {
            res.status(200).json({
                resultado: eventoActualizado
            });
        })
        .catch(() => {
            res.status(404).json({
                error: `Error actualizando entradas del evento ${idEvento}`
            });
        });

});

module.exports = router;