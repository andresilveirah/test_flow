const { get } = require('../client')

const CONFIG = {
  messageDataUrl: messageId => new URL(`https://message.sp-prod.net/mms/v2/message?message_id=${messageId}`)
}

const ACTIONS = {
  saveAndExit: 1,
  pmCancel: 2,
  acceptAll: 11,
  showPM: 12,
  rejectAll: 13,
  dismiss: 15
}

const getChoicesForMessageUrl = async (messageUrl) => {
  const messageId = (new URL(messageUrl)).searchParams.get("message_id")
  const message = await get(CONFIG.messageDataUrl(messageId))
  return message.message_choice
}

const getChoiceIdForAction = choices => action => choices.filter(choice => choice.type === action)[0].choice_id

const getChoiceIdForMessageUrl = async (action, url) => (getChoiceIdForAction(await getChoicesForMessageUrl(url))(action)).toString()

module.exports = {
  getChoiceIdForMessageUrl,
  ACTIONS
}

