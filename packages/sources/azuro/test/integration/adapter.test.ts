import { assertSuccess } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'
import { api } from '../api'

describe('execute', () => {
  const jobID = '1'
  const contractAddress = '0x2B609737b808b56205656EeE6AD87141E19389eC'
  const execute = makeExecute()

  describe('endpoint = open', () => {
    beforeEach(async () => {
      await api.post(`/rest/reset`)
      for (let i = 0; i < 3; i++) {
        await api.post(`/rest/mock/new`)
      }

      const data = await api.post('/rest/list/new')
      expect(data.data.length).toEqual(3)
    }, 20000)

    it('open market', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'open',
          contractAddress,
        },
      }

      const res = await execute(req as AdapterRequest)

      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)
      expect(res.data.result.length).toEqual(3)
      res.data.result.forEach((item) => {
        expect(item).toEqual({
          id: expect.any(Number),
          txHash: expect.any(String),
        })
      })

      await api.post('rest/call/cron_sc')
      const data = await api.post('/rest/list/new')
      expect(data.data.length).toEqual(0)
    }, 300000)
  })

  describe('endpoint = settle', () => {
    beforeEach(async () => {
      await api.post(`/rest/reset`)
      for (let i = 0; i < 3; i++) {
        await api.post(`/rest/mock/new`)
      }
      await api.post(`/rest/mock/resolved`)

      const data = await api.post('/rest/list/resolved')
      expect(data.data.length).toEqual(3)
    }, 20000)

    it('settle market', async () => {
      const req = {
        id: jobID,
        data: {
          endpoint: 'settle',
          contractAddress,
        },
      }

      const res = await execute(req as AdapterRequest)

      assertSuccess({ expected: 200, actual: res.statusCode }, res, jobID)
      expect(res.data.result.length).toEqual(3)
      res.data.result.forEach((item) => {
        expect(item).toEqual({
          id: expect.any(Number),
          txHash: expect.any(String),
        })
      })

      await api.post('rest/call/cron_sc')
      const data = await api.post('/rest/list/resolved')
      expect(data.data.length).toEqual(0)
    }, 300000)
  })
})
