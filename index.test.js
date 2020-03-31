const { getMessage, postConsent } = require('./index')

const PARAMS = {
  accountId: 22,
  propertyHref: "https://tcfv2.mobile.webview",
  propertyId: 7639,
  requestUUID: "test",
  euconsent: "",
  meta: "{}",
  requestFromPM: false,
  choiceId: "739690",
  actionType: 11
}

describe('full flow', () => {
  it('should not return a message url on the 2nd "get" message request', async (done) => {
    const firstCall = await getMessage(PARAMS)
    expect(firstCall).toHaveProperty('url')

    const secondCall = await postConsent({
      ...PARAMS,
      meta: firstCall.meta,
      uuid: firstCall.uuid
    })
    const thirdCall = await getMessage({
      ...PARAMS,
      meta: secondCall.meta,
      uuid: secondCall.uuid
    })
    expect(thirdCall).not.toHaveProperty('url')
    done()
  })
})


