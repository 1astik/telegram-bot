const { createLogger, format, transports, addColors } = require('winston')

module.exports = createLogger({
    transports: [
        new transports.Console()
    ],
    format: format.combine(
        format.colorize(addColors({
            error: 'red',
            warn: 'yellow',
            info: 'cyan',
            debug: 'green'
        })),
        format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )
})