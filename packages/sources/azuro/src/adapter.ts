import { Requester, AdapterError } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig, ExecuteFactory } from '@chainlink/types'
import { makeConfig } from './config'


export interface AzuroEvent {
  id: number
  odd1: number
  odd2: number
  startDate: number
  ipfsHash: string
}


export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  Requester.logConfig(config)

  const urlMap: Record<string, string> = {
    open: '/rest/list/new',
    settle: '/rest/list/resolved'
  }

  const methodMap: Record<string, string> = {
    test: 'post',
    prod: 'get'
  }

  const jobRunID = request.id
  const endpoint = request.data.endpoint.toLowerCase()

  if (!urlMap.hasOwnProperty(endpoint)) {
    throw new AdapterError({
      jobRunID,
      message: `Endpoint ${endpoint} not supported.`,
      statusCode: 400,
    })
  }

  const url = urlMap[endpoint]
  const method = methodMap[config.env]

  const options = {
    ...config.api,
    url,
    method
  }

  if (config.env === 'test') {
    options.headers['Authorization'] = 'OAuth dev-token'
  }

  const response = await Requester.request(options)
  const { data } = response

  if (data.length === 0) {
    return Requester.errored(jobRunID, "API returned empty result")
  }
  response.data.result = Object.values(response.data)

  return Requester.success(jobRunID, response, config.verbose)
}

export const makeExecute: ExecuteFactory<Config> = (config) => {
  return async (request) => execute(request, config || makeConfig())
}
