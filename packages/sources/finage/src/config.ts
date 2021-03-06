import { Requester } from '@chainlink/ea-bootstrap'
import { Config } from '@chainlink/types'

export const DEFAULT_ENDPOINT = 'relative-performance'
export const DEFAULT_BASE_URL = 'https://api.finage.co.uk/'

export const makeConfig = (prefix?: string): Config => {
  const config = Requester.getDefaultConfig(prefix, true)
  config.api = {
    ...config.api,
    baseURL: config.api.baseURL || DEFAULT_BASE_URL,
  }
  return config
}
