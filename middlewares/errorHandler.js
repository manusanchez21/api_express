const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || "Hubo un error en el servidor"
    });
}

module.exports = errorHandler;