const https = require('https')
const { promisify } = require('util');

  const CONFIG = {
    wrapperApiBase: 'wrapper-api.sp-prod.net',
    messageUrl: '/tcfv2/v1/gdpr/message-url?inApp=true',
    nativeUrl: '/tcfv2/v1/gdpr/native-message?inApp=true',
    consentUrl: '/tcfv2/v1/gdpr/consent?inApp=true',
  }

const post = promisify((endpoint, payload, callback) => {
  const req = https.request({
    hostname: CONFIG.wrapperApiBase,
    path: endpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  }, response => {
    var chunks = [];
    response.on("data", chunk => chunks.push(chunk))
    response.on("end", _ => callback(null, JSON.parse(Buffer.concat(chunks).toString())))
  })
  req.on('error', error => callback(error, null))
  req.write(payload)
  req.end()
})

const getMessage = async (params) => await post(CONFIG.messageUrl, JSON.stringify(params))
const postConsent = async (params) => await post(CONFIG.consentUrl, JSON.stringify(params))

module.exports = { getMessage, postConsent }
