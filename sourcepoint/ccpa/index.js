const { get, post } = require('../../client')

const CONFIG = {
  messageUrl: (params) => new URL(`https://wrapper-api.sp-prod.net/ccpa/message-url?${new URLSearchParams(params)}`),
  consentUrl: (choiceType) => new URL(`https://wrapper-api.sp-prod.net/ccpa/consent/${choiceType}`),
}

const getMessage = async (params) => await get(CONFIG.messageUrl(params))
const postConsent = async (params) => await post(CONFIG.consentUrl(params.choiceType), JSON.stringify(params))

module.exports = {
  getMessage,
  postConsent
}