module.exports.asyncHttpWrapper = func => (...args) => Promise.resolve(func(...args)).catch(args[args.length - 1])
module.exports.asyncWsWrapper = (func, io, socket, handler, ...argsToBind) => (...args) => Promise
    .resolve(func.apply({io: io, socket: socket}, args.concat(argsToBind)))
    .catch((...args) => handler.call(socket, ...args))
module.exports.asyncEventsWrapper = (func, handler) => (...args) => Promise
    .resolve(func(...args))
    .catch(error => handler(error, ...args))