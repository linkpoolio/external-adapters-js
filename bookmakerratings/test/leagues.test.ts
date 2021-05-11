import { assert } from 'chai'
import { Requester } from '@chainlink/external-adapter'
import { assertSuccess, assertError } from '@chainlink/adapter-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../src/adapter'

describe('leagues execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  context('successful calls @integration', () => {
    const requests = [
      {
        name: 'id not supplied',
        testData: { data: { endpoint: 'leagues', sportIds: 33 } },
      },
      {
        name: 'sportIds',
        testData: { id: jobID, data: { endpoint: 'leagues', sportIds: 33 } },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        const data = await execute(req.testData as AdapterRequest)
        const { statusCode, result } = data
        assertSuccess({ expected: 200, actual: statusCode }, data, jobID)
        assert.isAbove(result.length, 0)
        // TODO: add additional assertions
      })
    })
  })

  context('error calls @integration', () => {
    const requests = [
      {
        name: 'unknown sportIds',
        testData: { id: jobID, data: { endpoint: 'leagues', sportIds: 'not_real' } },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        try {
          await execute(req.testData as AdapterRequest)
        } catch (error) {
          const errorResp = Requester.errored(jobID, error)
          assertError({ expected: 500, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })
})
