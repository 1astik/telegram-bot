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


async function getDialogs(params) {
    if (params.status === 'active'){
        return dialogRepository.findDialogs({active: true})
    }

    return dialogRepository.findDialogs({active: false})
}


async function getDialog(params) {
    return dialogRepository.findDialogById(params.id, params.countMessages)
}

async function changeStatusDialog(params){
   if (params.status === 'false'){
       params.status = false
   } else {
       params.status = true
   }
    return dialogRepository.changeStatusDialog(params.id, params.status)
}

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
