import { Requester } from '@chainlink/ea-bootstrap'
import { assertError, assertSuccess } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  it('open: is valid result', async () => {
    const req = {
      id: jobID,
      data: {
        endpoint: 'open'
      }
    }

    const res = await execute(req as AdapterRequest)
    
    assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)
    const { result } = res
    expect(Array.isArray(result)).toBe(true)
    expect(Array.isArray(res.data.result)).toBe(true)
    expect(Array.isArray(res.data.result)).toBeTruthy()
  })

  it('settle: is valid result', async () => {
    const req = {
      id: jobID,
      data: {
        endpoint: 'settle'
      }
    }

    const res = await execute(req as AdapterRequest)
    console.log(`test res: `, res)
    assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)
    const { result } = res
    expect(Array.isArray(result)).toBe(true)
    expect(Array.isArray(res.data.result)).toBe(true)
    expect(Array.isArray(res.data.result)).toBeTruthy()
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
