import { Requester, util } from '@chainlink/ea-bootstrap'
import { Config as ChainlinkConfig } from '@chainlink/types'

export const NAME = 'AZURO'

const pickBaseUrl: Record<string, string> = {
  test: 'http://artyrian.site',
  prod: 'https://azuro.org'
}

export type Config = ChainlinkConfig & {
  env?: string
}

export const makeConfig = (prefix?: string): Config => {
  const config: Config = Requester.getDefaultConfig(prefix)
  config.env = String(process.env.NODE_ENV).toLowerCase() || 'prod'
  config.apiKey = util.getEnv('API_KEY', prefix)
  config.api.baseURL = pickBaseUrl[config.env]
  return config
}
