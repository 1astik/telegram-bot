

/**
 * @type {import('./Config').ApplicationConfiguration}
 */
module.exports =  new (require('./Config'))(require('./default.json'), process.env)