import { Requester } from '@chainlink/ea-bootstrap'
import { assertError, assertSuccess } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  describe('successful calls @integration', () => {

    it('crypto-sentiment: without job id', async () => {
      const req = {
        data: {
          endpoint: 'crypto-sentiment',
          token: 'ETH',
          period: 1
        }
      }
      const res = await execute(req as AdapterRequest)
      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(res.result).toBeGreaterThan(0)
      expect(res.data.result).toBeGreaterThan(0)
    })

    it('crypto-sentiment: with job id', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'crypto-sentiment',
          token: 'ETH',
          period: 1
        }
      }
      const res = await execute(req as AdapterRequest)
      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(res.result).toBeGreaterThan(0)
      expect(res.data.result).toBeGreaterThan(0)
    })

    it('crypto-sentiment: with no token', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'crypto-sentiment',
          period: 1
        }
      }
      const res = await execute(req as AdapterRequest)
      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(res.result).toBeGreaterThan(0)
      expect(res.data.result).toBeGreaterThan(0)
    })

    it('crypto-sentiment: with no period', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'crypto-sentiment',
          token: 'ETH',
        }
      }
      const res = await execute(req as AdapterRequest)
      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(res.result).toBeGreaterThan(0)
      expect(res.data.result).toBeGreaterThan(0)
    })

    it('crypto-sentiment: with lowercase token', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'crypto-sentiment',
          token: 'eth',
          period: 1
        }
      }
      const res = await execute(req as AdapterRequest)
      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(res.result).toBeGreaterThan(0)
      expect(res.data.result).toBeGreaterThan(0)
    })

    it('crypto-sentiment: with mixed case token', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'crypto-sentiment',
          token: 'eTh',
          period: 1
        }
      }
      const res = await execute(req as AdapterRequest)
      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(res.result).toBeGreaterThan(0)
      expect(res.data.result).toBeGreaterThan(0)
    })
  })

  describe('error calls @integration', () => {
    it('crypto-sentiment: unknown endpoint', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'xyz-dne',
          token: 'ETH',
          period: 1
        }
      }
      try {
        await execute(req as AdapterRequest)
      } catch (error) {
        const errorResp = Requester.errored(jobID, error)
        assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
      }
    })

    it('crypto-sentiment: unknown token', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'crypto-sentiment',
          token: 'Z$1',
          period: 1
        }
      }
      try {
        await execute(req as AdapterRequest)
      } catch (error) {
        const errorResp = Requester.errored(jobID, error)
        assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
      }
    })

    it('crypto-sentiment: unknown period', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'crypto-sentiment',
          token: 'ETH',
          period: 9001
        }
      }
      try {
        await execute(req as AdapterRequest)
      } catch (error) {
        const errorResp = Requester.errored(jobID, error)
        assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
      }
    })
  })
})
