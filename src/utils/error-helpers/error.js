const {BadRequest, NotFound} = require('../error')


/** @param {Error} error @throws {Error|BadRequest} */
function checkErrorUniqueKey(error, message) {
    if (error.name === 'MongoError' && error.code === 11000)
        throw new BadRequest(message)
    else
        throw error
}

function checkNotFoundStatus(error, message) {
    if (error.statusCode === 404)
        throw new NotFound(message)
    else
        throw error
}

function isUniqueKeyError(error) {
    return error.name === 'MongoError' && error.code === 11000
}


module.exports = {
    checkErrorUniqueKey,
    checkNotFoundStatus,
    isUniqueKeyError
}