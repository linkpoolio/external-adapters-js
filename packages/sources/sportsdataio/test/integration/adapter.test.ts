import { Requester } from '@chainlink/ea-bootstrap'
import { assertError, assertSuccess } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'
import { ethers } from 'ethers'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  describe('successful calls @integration', () => {
    const requests = [
      {
        name: 'id not supplied',
        testData: {
          data: {
            sport: 'soccer',
            endpoint: 'odds',
            date: '2021-06-12',
            team: 'Sporting Kansas City',
          },
        },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        const data = await execute(req.testData as AdapterRequest)
        assertSuccess({ expected: 200, actual: data.statusCode }, data, jobID)
        expect(data.result.length).toBe(3)
      })
    })
  })

  describe.skip('error calls @integration', () => {
    const requests = [
      {
        name: 'unknown sport',
        testData: { id: jobID, data: { sport: 'xyz_flying', endpoint: 'odds' } },
      },
      {
        name: 'soccer - unknown endpoint',
        testData: { id: jobID, data: { sport: 'soccer', endpoint: 'xyz' } },
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
