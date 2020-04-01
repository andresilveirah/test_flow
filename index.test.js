const {
  getMessage,
  postConsent,
  getChoicesForMessageUrl,
  getChoiceIdForAction
} = require('./index')

jest.setTimeout(10000)

const ACTIONS = {
  acceptAll: 11
}

describe('full flow', () => {
  describe('web', () => {
    let propertyWeb =  {
      accountId: 22,
      propertyHref: "https://tcfv2.mobile.webview",
      propertyId: 7639,
      requestUUID: "test",
      euconsent: "",
      meta: "{}",
      requestFromPM: false
    }
    it('should not return a message url on the 2nd "get" message request', async (done) => {
      const firstCall = await getMessage(propertyWeb)
      expect(firstCall).toHaveProperty('url')

      const choiceId = getChoiceIdForAction(await getChoicesForMessageUrl(firstCall.url))(ACTIONS.acceptAll)
      expect(choiceId).toBeDefined()

      const secondCall = await postConsent({
        ...propertyWeb,
        meta: firstCall.meta,
        uuid: firstCall.uuid,
        choiceId: choiceId.toString(),
        choiceType: ACTIONS.acceptAll
      })
      const thirdCall = await getMessage({
        ...propertyWeb,
        meta: secondCall.meta,
        uuid: secondCall.uuid
      })
      expect(thirdCall).not.toHaveProperty('url')
      done()
    })
  })
})


