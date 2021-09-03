const config = require('../../config')
const TelegramApi = require('node-telegram-bot-api')
const dialogService = require('./service')
const moment = require('moment')

let lastDialog = ''


const bot = new TelegramApi(config.telegram.token, {polling: true})


const menu = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{text: 'Диалоги', callback_data: '{"module" : "menu", "info": "active"}'}], [{text: 'Архив', callback_data: '{"module" : "menu", "info": "archive"}'}]],
    })
}


const start = async () => {


    bot.setMyCommands([
        {command: '/start', description: 'Start bot'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                lastDialog = ''

                return  bot.sendMessage(chatId, 'Меню', menu);
            } else if (lastDialog){
                if (msg?.reply_to_message?.text?.length < 10){
                    return void 0
                }
                return  dialogService.addMessage({id: lastDialog, text, authorId: msg.chat.username})
            }
        } catch (e) {
            return bot.sendMessage(chatId, `Some error: ${e.message}`);
        }

    })


    bot.on('callback_query', async msg => {
        const data = JSON.parse(msg.data);
        const chatId = msg.message.chat.id;


        if (msg.message.text === 'Меню'){
            await onMenu(data.info, chatId)
        }
        if (msg.message.text === 'Диалоги'){
            await onDialog(data.info, chatId)
        }
        if (msg.message.text === 'Опции' && data.countMessages){
            await onDialog(data.id, chatId, data.countMessages )
        } else if (data.status) {
            await dialogService.changeStatusDialog({id: data.id, status:data.status})
            await onDialog(data.id, chatId)
        }

    })


    bot.on('reply_to_message', (msg) => {
        console.log(msg)
    })


}

async function onMenu(data, chatId) {

    lastDialog = ''

    const dialogs = await dialogService.getDialogs({status: data})

    const dialogsButton = {
        reply_markup: {
            inline_keyboard: []
        }
    }

    dialogs.forEach(dialog => {
        dialogsButton.reply_markup.inline_keyboard.push([{text: dialog.nameDialog, callback_data: `{"module": "dialogButton", "info": "${dialog._id}"}`}])
    })

    JSON.stringify(dialogsButton.reply_markup)

    await bot.sendMessage(chatId, 'Диалоги', dialogsButton)
}

async function onDialog(data, chatId, countMessages = -3) {

    lastDialog = data

    const dialog = await dialogService.getDialog({id: data, countMessages})

    await bot.sendMessage(chatId, `${dialog.nameDialog}`)

    for (const msg of dialog.messages){
        await  bot.sendMessage(chatId, `${msg.authorName || msg.authorId}/ ${moment.unix(msg.createdAt).utc()} \n ${msg.text}`);
    }

    const textButton = dialog.active ? 'Завершить' : 'Открыть'

    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Еще', callback_data: `{"countMessages": "${countMessages-3}", "id": "${data}"}`}, {text: textButton, callback_data: `{"id": "${data}", "status": "${dialog.active}"}`}]]
        })
    }

    await bot.sendMessage(chatId, 'Опции', options)
}


module.exports = {
    start
}