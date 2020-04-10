const properties = require('../properties')
const { ACTIONS } = require('../sourcepoint')

const { tcfv2, ccpa } = require('./')

describe('full flow', () => {
  describe('tcfv2 web', () => {
    it('should not return a message url on the 2nd "get" message request', async () => {
      const thirdCallsResponse = await tcfv2.web(properties.tcfv2.web, ACTIONS.acceptAll)
      expect(thirdCallsResponse).toEqual(expect.objectContaining({
        meta: expect.any(String),
        uuid: expect.any(String),
        userConsent: expect.objectContaining({
          euconsent: expect.any(String),
          acceptedVendors: expect.any(Array),
          acceptedCategories: expect.any(Array),
          TCData: expect.any(Object),
        })
      }))
      expect(thirdCallsResponse).not.toHaveProperty('url')
    })
  })

  describe('ccpa web', () => {
    it('should not return a message url on the 2nd "get" message request', async () => {
      const thirdCallsResponse = await ccpa.web(properties.ccpa.web, ACTIONS.acceptAll)
      expect(thirdCallsResponse).toEqual(expect.objectContaining({
        meta: expect.any(String),
        uuid: expect.any(String),
        userConsent: expect.objectContaining({
          status: expect.stringMatching(/^consentedAll$/),
          rejectedVendors: expect.any(Array),
          rejectedCategories: expect.any(Array)
        })
      }))
      expect(thirdCallsResponse).not.toHaveProperty('url')
    })
  })
})