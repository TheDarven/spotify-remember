import { Response } from "express"

export class FunctionalException extends Error {
    private readonly _code: number

    constructor(message: string, code: number) {
        super(message)
        this._code = code
    }

    get code(): number {
        return this._code
    }
}

export function buildExceptionResponse(res: Response, err: Error, defaultMessage: string): Response {
    let code = 500
    let message = defaultMessage
    if (err instanceof FunctionalException) {
        code = (err as FunctionalException).code
        message = err.message
    }
    return res.status(code).json({ code, message })
}

/**
 * Retourne <b>err</b> si c'est une <b>FunctionalException</b>,
 * construit une <b>FunctionalException</b> avec les paramètres sinon.
 *
 * @param message
 * @param code
 * @param err
 * @returns {FunctionalException}
 */
export function buildIfNotFunctionException(message: string, code: number, err: Error): FunctionalException {
    return err instanceof FunctionalException
        ? err
        : new FunctionalException(message, code)
}
