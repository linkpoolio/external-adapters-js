import { assert } from 'chai'
import { Requester } from '@chainlink/external-adapter'
import { assertSuccess, assertError } from '@chainlink/adapter-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../src/adapter'

describe('toss-results endpoint', () => {
  const jobID = '1'
  const execute = makeExecute()

  context('successful calls @integration', () => {
    const requests = [
      {
        name: 'id not supplied',
        testData: { data: { round: '1st Match', endpoint: 'toss-results' } },
      },
      {
        name: 'round',
        testData: { id: jobID, data: { round: '1st Match', endpoint: 'toss-results' } },
      },
      {
        name: 'round/season_id',
        testData: {
          id: jobID,
          data: { round: '1st Match', season_id: 708, endpoint: 'toss-results' },
        },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        const data = await execute(req.testData as AdapterRequest)
        assertSuccess({ expected: 200, actual: data.statusCode }, data, jobID)
        assert.isTrue(data.result === 'away')
        assert.isTrue(data.data.result === 'away')
      })
    })
  })

  context('validation error', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      {
        name: 'round not supplied',
        testData: { id: jobID, data: { season_id: 708, endpoint: 'toss-results' } },
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
        name: 'unknown season_id',
        testData: {
          id: jobID,
          data: { round: '1st Match', season_id: 'not_real', endpoint: 'toss-results' },
        },
      },
      {
        name: 'unknown round',
        testData: {
          id: jobID,
          data: { round: 'not_real', season_id: 708, endpoint: 'toss-results' },
        },
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
