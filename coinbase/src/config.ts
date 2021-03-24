import { Requester } from '@chainlink/external-adapter'
import { Config } from '@chainlink/types'

export const DEFAULT_ENDPOINT = 'price'
export const DEFAULT_API_ENDPOINT = 'https://api.coinbase.com'

export const makeConfig = (prefix?: string): Config => {
  const config = Requester.getDefaultConfig(prefix)
  config.api.baseURL = config.api.baseUrl || DEFAULT_API_ENDPOINT
  return config
}
