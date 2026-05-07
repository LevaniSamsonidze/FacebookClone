class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode,
        this.errorMessage = message,
        this.ok = false
    }
}

const handleError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        ok: false,
        status: statusCode,
        message
    });
};
module.exports = {
    AppError,
    handleError
}