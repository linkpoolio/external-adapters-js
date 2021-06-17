import { Requester } from '@chainlink/ea-bootstrap'
import { assertError, assertSuccess } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  describe('successful calls @integration', () => {
    it('property-details: get property avm', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'property-details',
          property_id: 100000125583
        }
      }
      const res = await execute(req as AdapterRequest)
      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(res.result).toBeGreaterThan(0)
      expect(res.data.result).toBeGreaterThan(0)
    })

    it('multi: get property avm by address', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'property-avm',
          address: '1200 broadway 91504'
        },
      }
      const res = await execute(req as AdapterRequest)
      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(res.result).toBeGreaterThan(0)
      expect(res.data.result).toBeGreaterThan(0)
    })

    it('multi: get address avm by street + zip', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'property-avm',
          street: '1200 broadway',
          zip: 91504
        },
      }
      const res = await execute(req as AdapterRequest)
      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)

      expect(res.result).toBeGreaterThan(0)
      expect(res.data.result).toBeGreaterThan(0)
    })
  })

  describe('error calls @integration', () => {

    describe('property-details', () => {
      it('invalid property id', async () => {
        const req = {
          id: jobID,
          data: {
            endpoint: 'property-details',
            property_id: 100000000000
          }
        }

        try {
          await execute(req as AdapterRequest)
        } catch (error) {
          const errorResp = Requester.errored(jobID, error)
          assertError({ expected: 500, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
    
    describe('addresses-suggest', () => {
      it('empty address', async () => {
        const req = {
          id: jobID,
          data: {
            endpoint: 'property-avm',
          },
        }

        try
        {
          await execute(req as AdapterRequest)
        } catch (err)
        {
          const errorResp = Requester.errored(jobID, err)
          assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })

      it('returned multiple properties', async () => {
        const req = {
          id: jobID,
          data: {
            endpoint: 'property-avm',
            street: '1200 broadway'
          },
        }

        try
        {
          await execute(req as AdapterRequest)
        } catch (err)
        {
          const errorResp = Requester.errored(jobID, err)
          assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })
})
