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

/**
 * Retourne <b>err</b> si c'est une <b>FunctionalException</b>,
 * construit une <b>FunctionalException</b> avec les paramètres sinon.
 *
 * @param message
 * @param code
 * @param err
 * @returns {FunctionalException|FunctionalException}
 */
function buildIfNotFunctionException(message, code, err) {
    return err instanceof FunctionalException ? err : new FunctionalException(message, code)
}

module.exports = { FunctionalException, buildExceptionResponse, buildIfNotFunctionException };