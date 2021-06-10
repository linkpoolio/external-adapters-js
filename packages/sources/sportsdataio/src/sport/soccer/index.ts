import { AdapterError, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteFactory, ExecuteWithConfig } from '@chainlink/types'
import { DEFAULT_ENDPOINT, makeConfig } from '../../config'
import { odds } from './endpoint'

export const NAME = 'soccer'

const inputParams = {
  endpoint: true, // Options: odds
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, inputParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint || DEFAULT_ENDPOINT

  switch (endpoint.toLowerCase()) {
    case odds.NAME: {
      return await odds.execute(request, config)
    }
    default: {
      throw new AdapterError({
        jobRunID,
        message: `Endpoint ${endpoint} not supported.`,
        statusCode: 400,
      })
    }
  }
}

export const makeExecute: ExecuteFactory<Config> = (config) => {
  return async (request) => execute(request, config || makeConfig())
}
