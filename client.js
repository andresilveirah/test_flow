const https = require('https')
const { promisify } = require('util');

const responseToJson = callback => response => {
  var chunks = [];
  response.on("data", chunk => chunks.push(chunk))
  response.on("end", _ => callback(null, JSON.parse(Buffer.concat(chunks).toString())))
}

const get = promisify((url, callback) => {
  const req = https.request({
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'GET'
  }, responseToJson(callback))
  req.on('error', error => callback(error, null))
  req.end()
})

const post = promisify((url, payload, callback) => {
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