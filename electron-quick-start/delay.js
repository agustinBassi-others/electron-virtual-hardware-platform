'use strict'

async function delay (timeToWait) {
var timeout = ms => new Promise(res => setTimeout(res, ms))
    console.log('started')
    await timeout(timeToWait)
    console.log('finished')
}

delay(1000)