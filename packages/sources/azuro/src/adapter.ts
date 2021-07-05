import { Requester, AdapterError, Validator } from '@chainlink/ea-bootstrap'
import { AdapterRequest, AdapterResponse, ExecuteFactory } from '@chainlink/types'
import { Config, makeConfig } from './config'
import { ethers } from 'ethers'
import { abi } from './abi'
import { formatIpfsHash } from './util'

export interface AzuroEvent {
  id: number
  odd1: number
  odd2: number
  timestamp: number
  ipfsHash: string
}

export interface AzuroResponse {
  data: AzuroEvent[]
}

const customParams = {
  contractAddress: true,
  endpoint: true
}

export const execute = async (request: AdapterRequest, config: Config): Promise<AdapterResponse> => {
  Requester.logConfig(config)

  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  if (!config.env) {
    throw new Error(`No env configured`)
  }

  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint
  const contractAddress = validator.validated.data.contractAddress

  const urlMap: Record<string, string> = {
    open: '/rest/list/new',
    settle: '/rest/list/resolved'
  }

  const methodMap: Record<string, string> = {
    test: 'post',
    prod: 'get'
  }

  if (!config.wallet) {
    throw new Error(`No wallet configured`)
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

  const response: AzuroResponse = await Requester.request(options)
  const { data } = response

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected API response`)
  } else if (data.length === 0) {
    throw new AdapterError({
      jobRunID,
      message: "API returned empty result",
      statusCode: 500,
    })
  }

  const [event] = response.data
  const { id, odd1, odd2, timestamp, ipfsHash } = event

  const contract = new ethers.Contract(contractAddress, abi, config.wallet)
  const nonce = await config.wallet.getTransactionCount()
  const tx = await contract.createCondition(id, odd1, odd2, timestamp, formatIpfsHash(ipfsHash), { nonce })

  response.data = tx

  return Requester.success(jobRunID, response, config.verbose)
}


export const makeExecute: ExecuteFactory<Config> = (config) => {
  return async (request) => execute(request, config || makeConfig())
}
