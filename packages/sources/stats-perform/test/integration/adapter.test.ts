import { Requester } from '@chainlink/ea-bootstrap'
import { assertError, assertSuccess } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  describe('successful calls @integration', () => {
    const requests = [
      {
        name: 'id not supplied',
        testData: {
          data: {
            endpoint: 'medals',
            season: 2016
          }
        },
      },
      {
        name: 'id supplied',
        testData: {
          id: jobID,
          data: {
            endpoint: 'medals',
            season: 2016
          }
        },
      },
      {
        name: 'id supplied',
        testData: {
          id: jobID,
          data: {
            endpoint: 'medals',
            season: 2016,
            sortType: 'gold'
          }
        },
      }
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        const data = await execute(req.testData as AdapterRequest)
        assertSuccess({ expected: 200, actual: data.statusCode }, data, jobID)
        const expected = ["USA", "CHN", "GBR"]
        expect(data.result).toEqual(expect.arrayContaining(expected))
        expect(data.data.result).toEqual(expect.arrayContaining(expected))
      })
    })
  })

  describe('error calls @integration', () => {
    const requests = [
      {
        name: 'unknown sortType',
        testData: {
          id: jobID,
          data: {
            endpoint: "medals",
            season: 2016,
            sortType: 'temp'
          }
        },
      }
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
