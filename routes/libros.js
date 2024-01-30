const express = require("express");
const router = express.Router();
const libros = require("../data");
const Joi = require("joi");

const libroObject = Joi.object({
  titulo: Joi.string().required().label("Titulo"),
  autor: Joi.string().required().label("Autor"),
});

router.get("/", (req, res, next) => {
  try {
    res.json(libros);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const libro = libros.find((l) => Number(l.id) === id);
    if (!libro) {
      const error = new Error("Libro no encontrado");
      error.status = 404;
      throw error;
    }
    res.json(libro);
  } catch (err) {
    next(err);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { error, value } = libroObject.validate(req.body);

    if (error) {
      const valErr = new Error("Error de validacion");
      valErr.status = 400;
      valErr.details = error.details.map((detail) => detail.message);
      throw valErr;
    }

    const { titulo, autor } = value;

    const nuevoLibro = {
      id: libros.length + 1,
      titulo,
      autor,
    };

    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { error, value } = libroObject.validate(req.body);
    if (error) {
      const valErr = new Error("Error de validacion");
      valErr.status = 400;
      valErr.details = error.details.map((detail) => detail.message);
      throw valErr;
    }
    const { titulo, autor } = value;
    const libro = libros.find((l) => Number(l.id) === id);

    if (!libro) {
      const error = new Error("Libro no encontrado");
      error.status = 404;
      throw error;
    }

    libro.titulo = titulo || libro.titulo;
    libro.autor = autor || libro.autor;

    res.json(libro)

  } catch (err) {
    next(err);
  }
});


router.delete("/:id", (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const libroIndex = libros.find((l) => Number(l.id) === id);
  
        if (libroIndex === -1) {
        const error = new Error("Libro no encontrado");
        error.status = 404;
        throw error;
        }
    
        const libroEliminado = libros.splice(libroIndex, 1);
        res.json(libroEliminado[0])
    } catch (err) {
        next(err);
    }
})

  module.exports = router
