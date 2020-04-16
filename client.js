const https = require('https')
const { promisify } = require('util');

const SHOW_NETWORK_CALLS = false

const responseToJson = callback => response => {
  var chunks = [];
  response.on("data", chunk => chunks.push(chunk))
  response.on("end", _ => {
    const json = JSON.parse(Buffer.concat(chunks).toString())
    if(SHOW_NETWORK_CALLS)
      console.debug(`RESPONSE: ${response.req.method} ${response.req.path}\n${JSON.stringify(json, null, 2)}`)
    return callback(null, json)
  })
}

const get = promisify((url, callback) => {
  if(SHOW_NETWORK_CALLS)
    console.debug(`REQUEST: GET ${url.toString()}`)
  const req = https.request({
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'GET'
  }, responseToJson(callback))
  req.on('error', error => callback(error, null))
  req.end()
})

const post = promisify((url, payload, callback) => {
  if(SHOW_NETWORK_CALLS)
    console.debug(`REQUEST: POST ${url.toString()}\n${payload}`)

  const req = https.request({
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  }, responseToJson(callback))
  req.on('error', error => callback(error, null))
  req.write(payload)
  req.end()
})

module.exports = { get, post }