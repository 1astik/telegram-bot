const object = require('../utils/alg/object')



class Config {

    static from(config) {
        return new Config(config, {})
    }

    constructor(config, env) {

        this.usedEnv = []

        const envTable = {
            NODE_ENV: value => {
                config.env = value
                config.production = value === 'production'
                /**
                 * Переносим дефолтные значения для конфигурации окружения
                 */
                switch (value) {
                    case 'production':
                        object.replaceDeep(require('./production.json'), config)
                        break
                    default:
                        break
                }
            },

            DB_CONNECTION: connectionString => config.database.credentials.connectionString = connectionString,
            HTTP_PORT: port => config.server.HTTP.PORT = parseInt(port),
            TELEGRAM_API_KEY: token => config.telegram.token = token,
        }


        Object
            .keys(envTable)
            .forEach(key => {
                if (key in env) {
                    this.usedEnv.push(key)
                    envTable[key](env[key])
                }
            })

        Object.assign(this, config)
    }
}


module.exports = Config