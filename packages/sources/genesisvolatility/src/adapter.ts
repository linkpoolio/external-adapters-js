import { Requester, Validator, AdapterError } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig, ExecuteFactory } from '@chainlink/types'
import { makeConfig, DEFAULT_ENDPOINT } from './config'
import { deltaSkew3020, atmIv } from './endpoint'

const inputParams = {
  endpoint: false,
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, inputParams)
  if (validator.error) throw validator.error

  Requester.logConfig(config)

  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint || DEFAULT_ENDPOINT

  switch (endpoint.toLowerCase()) {
    case deltaSkew3020.NAME: {
      return await deltaSkew3020.execute(request, config)
    }
    case atmIv.NAME: {
      return await atmIv.execute(request, config)
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
