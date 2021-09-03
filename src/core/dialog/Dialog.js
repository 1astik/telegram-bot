const {Schema, model} = require('mongoose')

/**
 * @typedef DialogSchema
 * @type {Object}
 * @property {import('mongoose').ObjectId} _id
 * @property {String} nameDialog
 * @property {String} authorId
 * @property {Boolean} active
 * @property {Array} messages
 * @property {Date} createdAt
 *
 * @typedef {DialogSchema} DialogModel
 */


const DialogSchema = new Schema(
    {
        nameDialog: {
            type: String,
            required: [true, 'NameDialog is required']
        },
        authorId: {
            type: String,
            required: [true, 'AuthorId is required'],
        },
        active: {
            type: Boolean,
            required: [true, 'Active is required'],
            default: true
        },
        messages: {
            type: Array,
            items: {
                authorId: String,
                authorName: String,
                text: String,
                createdAt: Date
            }
        },
        createdAt: {
            type: Date
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

DialogSchema.index({active: 1})


module.exports = model('Dialog', DialogSchema, 'dialogs')


