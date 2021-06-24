import { Requester } from '@chainlink/ea-bootstrap'
import { assertError, assertSuccess } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'
import { api } from '../api'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  describe('endpoint = open', () => {
    // reset db and add fresh entry
    beforeEach(async () => {
      await api.post(`/rest/reset`)
      await api.post(`/rest/mock/new`)
    })

    it('is valid result', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'open'
        }
      }

      const res = await execute(req as AdapterRequest)

      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)
      expect(Array.isArray(res.data.result)).toBe(true)

      const [item] = res.data.result
      // Test against object properties
      expect(item).toEqual({
        id: expect.any(Number),
        odd1: expect.any(Number),
        odd2: expect.any(Number),
        timestamp: expect.any(Number),
        ipfsHash: expect.any(String),
      })
    })
  })

  describe('endpoint = settle', () => {
    beforeEach(async () => {
      await api.post(`/rest/reset`)
      await api.post(`/rest/mock/new`) // create mock data
      await api.post(`/rest/mock/resolved`) // update mock data
    }, 10000)

    it('is valid result', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'settle'
        }
      }

      const res = await execute(req as AdapterRequest)

      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(Array.isArray(res.data.result)).toBe(true)

      const [item] = res.data.result
      // Test against object properties
      expect(item).toEqual({
        id: expect.any(Number),
        result: expect.any(Number)
      })
    })
  })


  it('endpoint-dne: is invalid endpoint', async () => {
    const req = {
      id: jobID,
      data: {
        endpoint: 'endpoint-dne'
      }
    }

    try {
      await execute(req as AdapterRequest)
    } catch (err) {
      const errorResp = Requester.errored(jobID, err)
      assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
    }
  })
})
