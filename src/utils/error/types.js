

/**
 * @module ApplicationError
 * @summary Base Application Error classes
 */

class ApplicationError extends Error {

    static broadcastCopy = []

    /**
     * @param {ApplicationError} error 
     */
     static complianceHttpCode(error) {
        if (error instanceof IncorrectData) {
            return 400
        } else if (error instanceof Unauthorized) {
            return 401
        } else if (error instanceof Forbidden) {
            return 403
        } else if (error instanceof EntityNotExists) {
            return 404
        } else if (error instanceof UnprocessableEntity) {
            return 422
        } else {
            return 500
        }
    }

    constructor(message, code) {
        super()
        this.message = message
        this.code = code
        this.error = this.constructor.name
    }
}

class IncorrectData extends ApplicationError {
    constructor(message, code) {
        super(message, code)
    }
}

class ClientError extends ApplicationError {
    constructor(message, status) {
        super()
        this.message = message
        this.status = status
        Object.defineProperty(this, 'status', {enumerable: false})
    }
}

class Forbidden extends ApplicationError {
    constructor(message = 'Forbidden', code) {
        super(message, code)
    }
}

class Unauthorized extends ApplicationError {
    constructor(message = 'Unauthorized', code) {
        super(message, code)
    }
}

class UnprocessableEntity extends ApplicationError {
    constructor(message = 'Unprocessable Entity', code) {
        super(message, code)
    }
}

class EntityExists extends IncorrectData {
    constructor(message, code) {
        super(message, code)
    }
}

class EntityNotExists extends ApplicationError {
    constructor(message = 'Not found', code) {
        super(message, code)
    }
}

class InternalError extends ApplicationError {
    constructor(message = 'Internal Server Error', code = 0, meta) {
        super(message, code)
        this.meta = meta
    }
}


ApplicationError.IncorrectData = IncorrectData
ApplicationError.Forbidden = Forbidden
ApplicationError.Unauthorized = Unauthorized
ApplicationError.UnprocessableEntity = UnprocessableEntity
ApplicationError.EntityExists = EntityExists
ApplicationError.EntityNotExists = EntityNotExists
ApplicationError.InternalError = InternalError
ApplicationError.ClientError = ClientError


module.exports = ApplicationError