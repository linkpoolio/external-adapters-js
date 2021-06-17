import { Requester } from '@chainlink/ea-bootstrap'
import { assertError } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  describe('validation error', () => {
    const requests = [
      { name: 'empty body', testData: {}, expected: 400 },
      { name: 'empty data', testData: { data: {} }, expected: 400 },
      // {
      //   name: 'invalid property id',
      //   testData: { id: jobID, data: { endpoint: 'property-details', property_id: false } },
      // },
    ]

    requests.forEach((req) => {
      const { expected } = req
      it(`${req.name}`, async () => {
        try {
          await execute(req.testData as AdapterRequest)
        } catch (error) {
          const errorResp = Requester.errored(jobID, error)
          assertError({ expected, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })
})
