const Dialog = require('./Dialog')
// const {ObjectId} = require('mongoose').Types


const saveTestData = dialogs => Dialog
    .insertMany(dialogs)
    .then(data => data)

const countDialogs = () => Dialog
    .countDocuments({})


module.exports = {
    saveTestData,
    countDialogs
}
