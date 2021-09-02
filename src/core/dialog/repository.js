const Dialog = require('./Dialog')
const {ObjectId} = require('mongoose').Types


const saveTestData = dialogs => Dialog
    .insertMany(dialogs)
    .then(data => data)

const countDialogs = () => Dialog
    .countDocuments({})

const findDialogs = (options) => Dialog
    .find(options)
    .lean()

const findDialogById = (id, countMessages) => Dialog
    .findOne({_id: ObjectId(id)}, {'messages': {'$slice': Number(countMessages)} })
    .lean()

const changeStatusDialog = (id, status) => Dialog
    .findByIdAndUpdate( ObjectId(id), {active: !status })

const addNewMessage = (id, text, author) => Dialog
    .findByIdAndUpdate(ObjectId(id), {$push: {messages: {
                authorId : author,
                text,
                createdAt : Date.now()
            }}})


module.exports = {
    saveTestData,
    countDialogs,
    findDialogs,
    findDialogById,
    changeStatusDialog,
    addNewMessage
}
