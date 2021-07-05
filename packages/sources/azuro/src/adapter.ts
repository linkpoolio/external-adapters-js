import { Requester, AdapterError } from '@chainlink/ea-bootstrap'
import { AdapterRequest, AdapterResponse, ExecuteFactory } from '@chainlink/types'
import { Config, makeConfig } from './config'
import { ethers } from 'ethers'

export interface AzuroEvent {
  id: number
  odd1: number
  odd2: number
  startDate: number
  ipfsHash: string
}

export const execute = async (request: AdapterRequest, config: Config): Promise<AdapterResponse> => {
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
  const endpoint = String(request.data.endpoint).toLowerCase()


  if (!config.env) {
    throw new AdapterError({
      jobRunID,
      message: `No env configured`,
      statusCode: 400,
    })
  }

  if (!Object.prototype.hasOwnProperty.call(urlMap, endpoint)) {
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

  options.headers['Authorization'] = `OAuth ${config.apiKey}`

  const response = await Requester.request(options)
  const { data } = response

  if (data.length === 0) {
    throw new AdapterError({
      jobRunID,
      message: "API returned empty result",
      statusCode: 500,
    })
  }
  response.data.result = Object.values(response.data)

  return Requester.success(jobRunID, response, config.verbose)
}


export const makeExecute: ExecuteFactory<Config> = (config) => {
  return async (request) => execute(request, config || makeConfig())
}
