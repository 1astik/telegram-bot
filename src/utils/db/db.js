const mongoose = require('mongoose')
const config = require('../../config')
const logger = require('../winston')
const testData = require('./test-data')
const dialogService = require('../../core/dialog')

async function connect(connectString = config.database.credentials.connectionString) {
    return await mongoose.connect(connectString, config.database.options)
}

async function init() {
    logger.info('Init test data')

    await dialogService.initDataTest(testData)
}

async function finalConnection(connectString = config.database.credentials.connectionString) {
    const connection = await connect(connectString).catch((err) => {
        throw new Error(err.message)
    })

    await init()

    return connection
}


module.exports = {
    finalConnection
}