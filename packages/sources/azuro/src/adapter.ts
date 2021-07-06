import { Requester, AdapterError, Logger, Validator } from '@chainlink/ea-bootstrap'
import { AdapterRequest, AdapterResponse, ExecuteFactory } from '@chainlink/types'
import { Config, makeConfig } from './config'
import { ethers } from 'ethers'
import { abi, packedAbi } from './abi'
import { formatIpfsHash } from './util'

export interface AzuroEvent {
  id: number
}

export interface AzuroCreateEvent extends AzuroEvent {
  odd1: number
  odd2: number
  timestamp: number
  ipfsHash: string
}

export interface AzuroResolveEvent extends AzuroEvent {
  result: number
}

export interface AzuroResponse {
  data: AzuroEvent[]
}

const customParams = {
  endpoint: true,
  contractAddress: true,
  packed: false
}

export const execute = async (request: AdapterRequest, config: Config): Promise<AdapterResponse> => {
  Requester.logConfig(config)
  // --- Validation ---
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  if (!config.env) {
    throw new Error(`No env configured`)
  }

  // --- Initialization ---
  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint
  const contractAddress = validator.validated.data.contractAddress
  const packed = validator.validated.data.unpacked || false

  const urlMap: Record<string, string> = {
    open: '/rest/list/new',
    settle: '/rest/list/resolved'
  }

  // When NODE_ENV = test => post
  //               = prod => get
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

  // --- API Configuration ---
  const url = urlMap[endpoint]
  const method = methodMap[config.env]

  const options = {
    ...config.api,
    url,
    method
  }

  options.headers['Authorization'] = `OAuth ${config.apiKey}`

  // --- API Request ---
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

  // --- API Endpoint Handlers ---
  const [event] = response.data
  const packedContract = new ethers.Contract(contractAddress, packedAbi, config.wallet)
  const contract = new ethers.Contract(contractAddress, abi, config.wallet)
  const nonce = await config.wallet.getTransactionCount()
  let tx = {}

  const methods: Record<string, CallableFunction> = {
    open: async () => {
      const { id, odd1, odd2, timestamp, ipfsHash } = event as AzuroCreateEvent

      if (packed) {
        const types = ["uint256", "uint256[]", "uint256", "string"]
        const values = [id, [odd1, odd2], timestamp, ipfsHash]
        const calldata = ethers.utils.defaultAbiCoder.encode(types, values)
        tx = await packedContract.createCondition(calldata)
      } else {
        tx = await contract.createCondition(id, odd1, odd2, timestamp, formatIpfsHash(ipfsHash), { nonce })
      }
    },
    settle: async () => {
      const { id, result } = event as AzuroResolveEvent

      if (packed) {
        const types = ["uint256", "uint8"]
        const values = [id, result]
        const calldata = ethers.utils.defaultAbiCoder.encode(types, values)
        tx = await packedContract.resolveCondition(calldata)
      } else {
        tx = await contract.resolveCondition(id, result, { nonce })
      }
    }
  }

  methods[endpoint]()

  Logger.debug(`tx: `, tx)

  return Requester.success(jobRunID, tx, config.verbose)
}


export const makeExecute: ExecuteFactory<Config> = (config) => {
  return async (request) => execute(request, config || makeConfig())
}
