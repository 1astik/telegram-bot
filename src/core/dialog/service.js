const dialogRepository = require('./repository')
const logger = require('../../utils/winston')
// const {EntityExists, Forbidden} = require('utils/error')


async function initDataTest(dialogs) {

    let count = await dialogRepository.countDialogs()

    if (count === 0){
        count = await dialogRepository.saveTestData(dialogs)
    }

    logger.info(`Create ${count.length || count} test dialogs.`)
}



module.exports = {
    initDataTest
}
