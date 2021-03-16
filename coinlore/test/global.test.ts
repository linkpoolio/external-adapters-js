import { assertError, assertSuccess } from '@chainlink/adapter-test-helpers'
import { Requester } from '@chainlink/external-adapter'
import { AdapterRequest } from '@chainlink/types'
import { assert } from 'chai'
import { makeExecute } from '../src/adapter'

xdescribe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  context('successful calls @integration', () => {
    const requests = [
      {
        name: 'id not supplied',
        testData: { data: { market: 'BTC' } },
      },
      {
        name: 'id is supplied',
        testData: { id: jobID, data: { market: 'ETH' } },
      },
      {
        name: 'to',
        testData: { id: jobID, data: { to: 'BTC' } },
      },
      {
        name: 'quote',
        testData: { id: jobID, data: { quote: 'BTC' } },
      },
      {
        name: 'global marketcap',
        testData: { id: jobID, data: { endpoint: 'globalmarketcap', quote: 'USD' } },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        const data = await execute(req.testData as AdapterRequest)
        assertSuccess({ expected: 200, actual: data.statusCode }, data, jobID)
        assert.isAbove(data.result, 0)
        assert.isAbove(data.data.result, 0)
      })
    })
  })

  context('validation error', () => {
    const requests = [
      {
        name: 'market not supplied',
        testData: { id: jobID, data: {} },
      },
    ]
    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        try {
          await execute(req.testData as AdapterRequest)
        } catch (error) {
          const errorResp = Requester.errored(jobID, error)
          assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })

  context('error calls @integration', () => {
    const requests = [
      {
        name: 'unknown market',
        testData: { id: jobID, data: { market: 'not_real' } },
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
