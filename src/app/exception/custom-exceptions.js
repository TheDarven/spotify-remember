function FunctionalException(message, code) {
    this.message = message;
    this.code = code;
}

function buildExceptionResponse(res, err, defaultMessage) {
    let code = 500;
    let message = defaultMessage;
    if (err instanceof FunctionalException) {
        code = err.code
        message = err.message
    }
    return res.status(code).json({ code, message });
}

module.exports = { FunctionalException, buildExceptionResponse };