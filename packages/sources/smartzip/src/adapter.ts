import { Requester, Validator, AdapterError } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig, ExecuteFactory } from '@chainlink/types'
import { makeConfig } from './config'
import { AddressesSuggest, PropertyDetails } from './endpoint'

const inputParams = {
  endpoint: true,
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, inputParams)
  if (validator.error) throw validator.error

  Requester.logConfig(config)

  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint

  switch (endpoint.toLowerCase())
  {
    // Uses the addresses suggest and property details endpoints to retrieve a 
    // property's AVM
    case 'property-avm': {
      const { result } = await AddressesSuggest.execute(request, config)
      // Set property_id on the request object to be used in the PropertyDetails request
      request.data.property_id = result
      return await PropertyDetails.execute(request, config)
    }
    case PropertyDetails.NAME: {
      return await PropertyDetails.execute(request, config)
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
