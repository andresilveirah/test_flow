const { post } = require('../../../client')

const CONFIG = {
  messageUrl: new URL('https://wrapper-api.sp-prod.net/tcfv2/v1/gdpr/message-url?inApp=true'),
  nativeUrl: new URL('https://wrapper-api.sp-prod.net/tcfv2/v1/gdpr/native-message?inApp=true'),
  consentUrl: new URL('https://wrapper-api.sp-prod.net/tcfv2/v1/gdpr/consent?inApp=true'),
}

const getNative = async (params) => await post(CONFIG.nativeUrl, JSON.stringify(params))
const getMessage = async (params) => await post(CONFIG.messageUrl, JSON.stringify(params))
const postConsent = async (params) => await post(CONFIG.consentUrl, JSON.stringify(params))

module.exports = {
  getNative,
  getMessage,
  postConsent
}