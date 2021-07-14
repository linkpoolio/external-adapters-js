import { Requester } from '@chainlink/ea-bootstrap'
import { assertError, assertSuccess } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'

describe('atm-iv endpoint', () => {
  const jobID = '1'
  const execute = makeExecute()

  describe('successful calls @integration', () => {
    const requests = [
      {
        name: 'id not supplied',
        testData: { data: { symbol: 'BTC', daysOut: 10, endpoint: 'atm-iv' } },
      },
      {
        name: 'symbol/daysOut',
        testData: { id: jobID, data: { symbol: 'BTC', daysOut: 10, endpoint: 'atm-iv' } },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        const data = await execute(req.testData as AdapterRequest)
        console.log(JSON.stringify(data, null, 2))
        assertSuccess({ expected: 200, actual: data.statusCode }, data, jobID)
        expect(data.result).toBeGreaterThan(0)
        expect(data.data.result).toBeGreaterThan(0)
      })
    })
  })

  describe('validation error', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      {
        name: 'symbol not supplied',
        testData: { id: jobID, data: { daysOut: 10, endpoint: 'atm-iv' } },
      },
      {
        name: 'daysOut not supplied',
        testData: { id: jobID, data: { symbol: 'BTC', endpoint: 'atm-iv' } },
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

  describe('error calls @integration', () => {
    const requests = [
      {
        name: 'unknown symbol',
        testData: { id: jobID, data: { symbol: 'not_real', daysOut: 10, endpoint: 'atm-iv' } },
      },
      {
        name: 'invalid daysOut',
        testData: { id: jobID, data: { daysOut: 'not_real', symbol: 'BTC', endpoint: 'atm-iv' } },
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
