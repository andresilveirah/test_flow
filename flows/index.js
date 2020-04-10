const { getChoiceIdForMessageUrl } = require('../sourcepoint')
const tcfv2 = require('../sourcepoint/gdpr/tcfv2')
const ccpa = require('../sourcepoint/ccpa')

const getPostGetFlow = (getMessage, postConsent) => async (property, action) => {
  const firstCall = await getMessage(property)
  const secondCall = await postConsent({
    ...property,
    meta: firstCall.meta,
    uuid: firstCall.uuid,
    choiceId: await getChoiceIdForMessageUrl(action, firstCall.url),
    choiceType: action
  })
  return getMessage({
    ...property,
    meta: secondCall.meta,
    uuid: secondCall.uuid
  })
}

module.exports = {
  tcfv2: {
    web: getPostGetFlow(tcfv2.getMessage, tcfv2.postConsent)
  },
  ccpa: {
    web: getPostGetFlow(ccpa.getMessage, ccpa.postConsent)
  }
}