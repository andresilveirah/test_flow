const https = require('https')
const { promisify } = require('util');

const CONFIG = {
  messageUrl: new URL('https://wrapper-api.sp-prod.net/tcfv2/v1/gdpr/message-url?inApp=true'),
  nativeUrl: new URL('https://wrapper-api.sp-prod.net/tcfv2/v1/gdpr/native-message?inApp=true'),
  consentUrl: new URL('https://wrapper-api.sp-prod.net/tcfv2/v1/gdpr/consent?inApp=true'),
  messageDataUrl: messageId => new URL(`https://message.sp-prod.net/mms/v2/message?message_id=${messageId}`)
}

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

const getNative = async (params) => await post(CONFIG.nativeUrl, JSON.stringify(params))
const getMessage = async (params) => await post(CONFIG.messageUrl, JSON.stringify(params))
const postConsent = async (params) => await post(CONFIG.consentUrl, JSON.stringify(params))

const getChoicesForMessageUrl = async (messageUrl) => {
  const messageId = (new URL(messageUrl)).searchParams.get("message_id")
  const message = await get(CONFIG.messageDataUrl(messageId))
  return message.message_choice
}

const getChoiceIdForAction = choices => action => choices.filter(choice => choice.type === action)[0].choice_id

module.exports = {
  getMessage,
  postConsent,
  getNative,
  getChoicesForMessageUrl,
  getChoiceIdForAction
}
