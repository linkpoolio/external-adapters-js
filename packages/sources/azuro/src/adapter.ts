import { Requester, AdapterError, Logger, Validator } from '@chainlink/ea-bootstrap'
import { AdapterRequest, AdapterResponse, ExecuteFactory } from '@chainlink/types'
import { Config, makeConfig } from './config'
import { ethers } from 'ethers'
import https from 'https'
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

export interface TxConfig {
  nonce: number
}

const customParams = {
  endpoint: true,
  contractAddress: true,
  packed: false,
}

export const execute = async (
  request: AdapterRequest,
  config: Config,
): Promise<AdapterResponse> => {
  Requester.logConfig(config)
  // --- Validation ---
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  if (!config.env) {
    throw new Error(`No env configured`)
  }

  if (!config.wallet) {
    throw new Error(`No wallet configured`)
  }

  // --- Initialization ---
  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint
  const contractAddress = validator.validated.data.contractAddress
  const packed = validator.validated.data.unpacked || false

  const envConfigMap: Record<string, any> = {
    test: {
      method: 'post',
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    },
    prod: { method: 'get' },
  }

  const urlMap: Record<string, string> = {
    open: '/rest/list/new',
    settle: '/rest/list/resolved',
  }

  if (!Object.prototype.hasOwnProperty.call(urlMap, endpoint)) {
    throw new AdapterError({
      jobRunID,
      message: `Endpoint ${endpoint} not supported.`,
      statusCode: 500,
    })
  }

  // --- API Configuration ---
  const url = urlMap[endpoint]
  const envConfig = envConfigMap[config.env]
  const authorization = {
    Authorization: `OAuth ${config.apiKey}`,
  }

  const options = {
    ...config.api,
    ...envConfig,
    url,
    headers: {
      ...config.api.headers,
      ...authorization,
    },
  }

  // --- API Request ---
  const response: AzuroResponse = await Requester.request(options)
  const { data } = response

  if (!Array.isArray(data)) {
    throw new Error(`Unexpected API response`)
  } else if (data.length === 0) {
    throw new AdapterError({
      jobRunID,
      message: 'API returned empty result',
      statusCode: 500,
    })
  }

  // --- API Endpoint Handlers ---
  const packedContract = new ethers.Contract(contractAddress, packedAbi, config.wallet)
  const contract = new ethers.Contract(contractAddress, abi, config.wallet)

  const methods: Record<string, CallableFunction> = {
    open: async (event: AzuroCreateEvent, txConfig: TxConfig) => {
      const { id, odd1, odd2, timestamp, ipfsHash } = event
      let tx

      if (packed) {
        const types = ['uint256', 'uint256[]', 'uint256', 'string']
        const values = [id, [odd1, odd2], Math.trunc(timestamp), ipfsHash]
        const calldata = ethers.utils.defaultAbiCoder.encode(types, values)
        tx = await packedContract.createCondition(calldata, {
          ...txConfig,
        })
      } else {
        tx = await contract.createCondition(
          id,
          odd1,
          odd2,
          Math.trunc(timestamp),
          formatIpfsHash(ipfsHash),
          {
            ...txConfig,
          },
        )
      }
      await tx.wait()
      return tx
    },
    settle: async (event: AzuroResolveEvent, txConfig: TxConfig) => {
      const { id, result } = event
      let tx

      if (packed) {
        const types = ['uint256', 'uint8']
        const values = [id, result]
        const calldata = ethers.utils.defaultAbiCoder.encode(types, values)
        tx = await packedContract.resolveCondition(calldata, {
          ...txConfig,
        })
      } else {
        tx = await contract.resolveCondition(id, result, {
          ...txConfig,
        })
      }
      await tx.wait()
      return tx
    },
  }

  let succeeded = []
  let failed = 0
  let nonce = await config.wallet.getTransactionCount()

  for (let i = 0; i < data.length; i++) {
    try {
      let tx = await methods[endpoint](data[i], { nonce })
      nonce++
      succeeded.push({ txHash: tx.hash, id: data[i].id })
      Logger.debug(`Tx: ${tx.hash}`)
    } catch (e) {
      failed++
      Logger.error(e)
    }
  }

  Logger.debug(`Updated ${succeeded.length} events`)
  Logger.debug(`Failed to update ${failed} events`)

  return Requester.success(jobRunID, { data: { result: succeeded } }, config.verbose)
}

export const makeExecute: ExecuteFactory<Config> = (config) => {
  return async (request) => execute(request, config || makeConfig())
}
