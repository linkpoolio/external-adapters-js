import { Requester, util } from '@chainlink/ea-bootstrap'
import { Config as ChainlinkConfig } from '@chainlink/types'

export const NAME = 'STATS_PERFORM'
export const DEFAULT_BASE_URL = 'http://api.stats.com/'

export type Config = ChainlinkConfig & {
  secret?: string
}

export const makeConfig = (prefix?: string): Config => {
  const config: Config = Requester.getDefaultConfig(prefix)
  config.api.baseURL = config.api.baseURL || DEFAULT_BASE_URL
  config.apiKey = util.getEnv('API_KEY', prefix)
  config.secret = util.getEnv('SECRET', prefix)
  return config
}
