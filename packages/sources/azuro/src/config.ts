import { Requester } from '@chainlink/ea-bootstrap'
import { Config } from '@chainlink/types'

export const NAME = 'AZURO'

const pickBaseUrl: Record<string, string> = {
  test: 'http://artyrian.site',
  prod: 'https://azuro.org'
}

export const makeConfig = (prefix?: string): Config => {
  const config = Requester.getDefaultConfig(prefix)
  config.env = String(process.env.NODE_ENV).toLowerCase() || 'prod'
  config.api.baseURL = pickBaseUrl[config.env]
  return config
}
