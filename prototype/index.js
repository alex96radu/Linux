'use strict'

const addon = require('./build/Release/addon.node')

console.log(addon)

console.log(`native addon whoami: ${addon.whoami()}`)
console.log(`native addon increment: ${addon.increment(1)}`)
console.log(`native addon increment: ${addon.increment(1)}`)