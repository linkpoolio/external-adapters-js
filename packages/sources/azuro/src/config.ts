import { Requester, util } from '@chainlink/ea-bootstrap'
import { Config as ChainlinkConfig } from '@chainlink/types'
import { ethers } from 'ethers'

export const NAME = 'AZURO'

const pickBaseUrl: Record<string, string> = {
  test: 'https://artyrian.site',
  prod: 'https://azuro.org',
}

export type Config = ChainlinkConfig & {
  env?: string
  wallet?: ethers.Wallet
}

export const makeConfig = (prefix?: string): Config => {
  const config: Config = Requester.getDefaultConfig(prefix)
  const rpcUrl = util.getRequiredEnv('RPC_URL', prefix)
  const privateKey = util.getRequiredEnv('PRIVATE_KEY', prefix)
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

  config.env = String(process.env.NODE_ENV).toLowerCase() || 'prod'
  config.apiKey = util.getEnv('API_KEY', prefix)
  config.api.baseURL = pickBaseUrl[config.env]
  config.wallet = new ethers.Wallet(privateKey, provider)
  return config
}
