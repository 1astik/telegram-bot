const config = require('../../config')
const TelegramApi = require('node-telegram-bot-api')
const dialogService = require('./service')
const moment = require('moment')
const logger = require('../../utils/winston')

let lastDialog = ''


const bot = new TelegramApi(config.telegram.token, {polling: true})


const menu = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{text: 'Диалоги', callback_data: '{"module" : "menu", "info": "active"}'}], [{
            text: 'Архив',
            callback_data: '{"module" : "menu", "info": "archive"}'
        }]],
    })
}


const start = async () => {

    bot.setMyCommands([
        {command: '/start', description: 'Start bot'}
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        try {
            if (text === '/start') {
                lastDialog = ''

                return bot.sendMessage(chatId, 'Меню', menu)
            } else if (lastDialog) {
                if (msg?.reply_to_message?.text?.length < 10) {
                    return void 0
                }
                const authorId = msg.chat.username ? msg.chat.username : msg.chat.first_name + ' ' + msg.chat.last_name

                return dialogService.addMessage({id: lastDialog, text, authorId})
            }
        } catch (e) {
            logger.error(`Error in BOT(message): ${e.message}`)

            return bot.sendMessage(chatId, 'Возникла ошибка. Пожайлуста перезапустите бота!')
        }
    })


    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id
        try {
            const data = JSON.parse(msg.data)

            if (msg.message.text === 'Меню') {
                return onMenu(data.info, chatId)
            }
            if (msg.message.text === 'Диалоги') {
                return onDialog(data.info, chatId)
            }
            if (msg.message.text === 'Опции' && data.countMessages) {
                return onDialog(data.id, chatId, data.countMessages)
            } else if (data.status) {
                await dialogService.changeStatusDialog({id: data.id, status: data.status})
                return onDialog(data.id, chatId)
            }
        } catch (e) {
            logger.error(`Error in BOT(callback_query): ${e.message}`)

            return bot.sendMessage(chatId, 'Возникла ошибка. Пожайлуста перезапустите бота!')
        }
    })
}

async function onMenu(data, chatId) {
    try {
        lastDialog = ''

        const dialogs = await dialogService.getDialogs({status: data})

        const dialogsButton = {
            reply_markup: {
                inline_keyboard: []
            }
        }

        dialogs.forEach(dialog => {
            dialogsButton.reply_markup.inline_keyboard.push([{
                text: dialog.nameDialog,
                callback_data: `{"module": "dialogButton", "info": "${dialog._id}"}`
            }])
        })

        JSON.stringify(dialogsButton.reply_markup)

        return bot.sendMessage(chatId, 'Диалоги', dialogsButton)
    } catch (e) {
        logger.error(`Error in BOT(onMenu): ${e.message}`)

        return bot.sendMessage(chatId, 'Возникла ошибка. Пожайлуста перезапустите бота!')
    }
}

async function onDialog(data, chatId, countMessages = -3) {
    try {
        lastDialog = data

        const dialog = await dialogService.getDialog({id: data, countMessages})

        await bot.sendMessage(chatId, `${dialog.nameDialog}`)

        for (const msg of dialog.messages) {
            let localDate = moment.unix(msg.createdAt).local()
            localDate = localDate.format('YYYY-MM-DD HH:mm:ss')
            await bot.sendMessage(chatId, `${msg.authorName || msg.authorId}/ ${localDate} \n ${msg.text}`);
        }

        const textButton = dialog.active ? 'Завершить' : 'Открыть'

        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{
                    text: 'Еще',
                    callback_data: `{"countMessages": "${countMessages - 3}", "id": "${data}"}`
                }, {text: textButton, callback_data: `{"id": "${data}", "status": "${dialog.active}"}`}]]
            })
        }

        return bot.sendMessage(chatId, 'Опции', options)
    } catch (e) {
        logger.error(`Error in BOT(onDialog): ${e.message}`)

        return bot.sendMessage(chatId, 'Возникла ошибка. Пожайлуста перезапустите бота!')
    }
}


module.exports = {
    start
}