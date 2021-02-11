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

    xdescribe('save and exit', () => {
      it('it should contain accepted vendors', async () => {
        // TODO: pass the payload from PM
        const thirdCallsResponse = await tcfv2.web(properties.tcfv2.web, ACTIONS.saveAndExit, {
          acceptedVendors: ["5e4a5fbf26de4a77922b38a6"],
          acceptedCategories: ["5e87321eb31ef52cd96cc552"]
        })
        expect(thirdCallsResponse).toEqual(expect.objectContaining({
          meta: expect.any(String),
          uuid: expect.any(String),
          userConsent: expect.objectContaining({
            acceptedVendors: expect.arrayContaining(["5e4a5fbf26de4a77922b38a6"]),
            acceptedCategories: expect.arrayContaining(["5e87321eb31ef52cd96cc552"])
          })
        }))
        expect(thirdCallsResponse).not.toHaveProperty('url')
      })
    })
  })

  describe('ccpa web', () => {
    describe('accept all', () => {
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

    describe('save and exit', () => {
      describe('when there are no rejected vendor nor categories', () => {
        it('status should be "rejectedSome" and no url should be present', async () => {
          const thirdCallsResponse = await ccpa.web(properties.ccpa.web, ACTIONS.saveAndExit, {
            status: "rejectedSome",
            rejectedVendors: [],
            rejectedCategories: []
          })
          expect(thirdCallsResponse).toEqual(expect.objectContaining({
            meta: expect.any(String),
            uuid: expect.any(String),
            userConsent: expect.objectContaining({
              status: expect.stringMatching(/^rejectedSome$/),
              rejectedVendors: expect.arrayContaining([]),
              rejectedCategories: expect.arrayContaining([])
            })
          }))
          expect(thirdCallsResponse).not.toHaveProperty('url')
        })
      });

      describe('there are rejected vendors and categories', () => {
        it('status should be "rejectedSome" and it should not contain url', async () => {
          const thirdCallsResponse = await ccpa.web(properties.ccpa.web, ACTIONS.saveAndExit, {
            rejectedVendors: ["5dd83168aba21b1129cd7f9b"],
            rejectedCategories: ["5df91028cf42027ce707bb1f"]
          })
          expect(thirdCallsResponse).toEqual(expect.objectContaining({
            meta: expect.any(String),
            uuid: expect.any(String),
            userConsent: expect.objectContaining({
              status: expect.stringMatching(/^rejectedSome$/),
              rejectedVendors: expect.arrayContaining(["5dd83168aba21b1129cd7f9b"]),
              rejectedCategories: expect.arrayContaining(["5df91028cf42027ce707bb1f"])
            })
          }))
          expect(thirdCallsResponse).not.toHaveProperty('url')
        })
      });
    })
  })
})