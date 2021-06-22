import { AzuroEvent } from '../../src/adapter'
import { AxiosResponse } from 'axios'
import { api } from '../api'

export interface AzuroEventDetailed {
  id: number,
  name: string,
  entity1Name: string,
  entity1Image: string | null,
  entity2Name: string,
  entity2Image: null,
  odd1: number,
  odd2: number,
  startDate: string,
  timestamp: number,
  ipfsHash: string,
  created_ts: number,
  last_update_ts: number,
  status: 'new'
}

describe('@integration - api behavior', () => {
  let data: AzuroEvent[]

  // Reset the mock endpoint data
  beforeAll(() => api.post(`/rest/reset`))

  // Mock endpoint used to simulate creating new events
  it('creates new event', async () => {
    const res: AxiosResponse = await api.post(`/rest/mock/new`)
    data = res.data
    expect(res.data.length).toBeGreaterThan(0)
  })

  it('!! get new events', async () => {
    const res: AxiosResponse = await api.post(`/rest/list/new`)

    expect(res.data.length).toBeGreaterThan(0)
    // Compare to previous result
    expect(res.data.length).toBe(data.length)

    const [item] = res.data
    // Test against object properties
    expect(item).toEqual({
      id: expect.any(Number),
      odd1: expect.any(Number),
      odd2: expect.any(Number),
      timestamp: expect.any(Number),
      ipfsHash: expect.any(String),
    })
  })

  // Need to make a fixture for before this method to efficiently test
  // multiple (bulk) update and individual update
  it.skip('mocks contract tx', async () => {
    const { id } = data[0]
    const res: AxiosResponse = await api.post(`/rest/mock/cron_sc_new?id=${id}`)

    expect(res.data.matched_count).toBeGreaterThan(0)
  })

  it('mocks resolved event', async () => {
    const { data } = await api.post(`/rest/mock/resolved`)

    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)

    const [item] = data
    expect(item).toEqual({
      id: expect.any(Number),
      result: expect.any(Number),
      status: expect.any(String),
    })
  })

  // Need to make a fixture for before this method to efficiently test
  // multiple (bulk) update and individual update
  it('!! get finished events', async () => {
    const res: AxiosResponse = await api.post(`/rest/list/resolved`)

    expect(res.data.length).toBeGreaterThan(0)
    // Check that id is in listing
    const [{ id }] = data
    const finished = res.data.map(({ id }) => id).includes(id)
    expect(finished).toBe(true)
  })

  it.skip('mocks contract tx', async () => {
    const [{ id }] = data
    const res: AxiosResponse = await api.post(`/rest/mock/cron_sc_resolved?id=${id}`)

    expect(res.data.matched_count).toBe(1)

    // Make sure event is no longer in resolved
    const events = await api.post(`/rest/list/resolved`)

    const removed = events.every(({ id: i }) => i !== data[0].id)
    expect(removed).toBe(true)
  })
})