const dialogRepository = require('./repository')
const logger = require('../../utils/winston')


/**
 * @param {DialogModel[]} dialogs
 * @returns {Promise<void>}
 */
async function initDataTest(dialogs) {

    let count = await dialogRepository.countDialogs()

    if (count === 0){
        count = await dialogRepository.saveTestData(dialogs)
    }

    logger.info(`Create ${count.length || count} test dialogs.`)
}


/**
 * @param {{status: String}} params
 * @returns {Promise<DialogModel[]>}
 */
async function getDialogs(params) {
    if (params.status === 'active'){
        return dialogRepository.findDialogs({active: true})
    }

    return dialogRepository.findDialogs({active: false})
}

/**
 * @param {{id: String, countMessages: Number}} params
 * @returns {Promise<DialogModel>}
 */
async function getDialog(params) {
    return dialogRepository.findDialogById(params.id, params.countMessages)
}


/**
 * @param {{id: String, status: String}} params
 * @returns {Promise<DialogModel>}
 */
async function changeStatusDialog(params){
    const active = params.status !== 'false'

    return dialogRepository.changeStatusDialog(params.id, active)
}

/**
 * @param {{id: String, text: String, authorId: String}} params
 * @returns {Promise<DialogModel>}
 */
async function addMessage(params) {
    return dialogRepository.addNewMessage(params.id, params.text, params.authorId)
}



module.exports = {
    initDataTest,
    getDialogs,
    getDialog,
    changeStatusDialog,
    addMessage
}
