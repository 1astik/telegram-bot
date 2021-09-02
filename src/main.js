const express = require('express')
const db = require('./utils/db')
const config = require('../src/config')
const logger = require('./utils/winston')
const bot = require('../src/core/dialog/bot')

;(async function main() {
    const res = await db.finalConnection(config.database.credentials.connectionString)

    logger.info(`Connecting to the database. DB name: ${res.connection.name}. DB host: ${res.connection.host}`)

    const server = express()

    server.listen(config.server.HTTP.PORT, () => logger.info(`Http server has been started. Port: ${config.server.HTTP.PORT}`))

    await bot.start()
})()