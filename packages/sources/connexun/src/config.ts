import { Requester, util } from '@chainlink/ea-bootstrap'
import { Config } from '@chainlink/types'

export const NAME = 'CONNEXUN'

export const DEFAULT_BASE_URL = 'https://api.connexun.com'

export const makeConfig = (prefix?: string): Config => {
  const config = Requester.getDefaultConfig(prefix)
  config.api.baseURL = config.api.baseURL || DEFAULT_BASE_URL
  config.api.headers['x-api-key'] = util.getEnv('API_KEY', prefix)
  return config
}
