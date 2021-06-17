import { Requester, Validator, AdapterError } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig } from '@chainlink/types'

export const NAME = 'addresses-suggest'

const customError = (data: any) => data.Response === 'Error'

const customParams = {
  address: false,
  street: false,
  city: false,
  state: false,
  zip: false,
}

interface SmartZipAddress {
  [index: string]: string | number | undefined
  address?: string,
  street?: string
  city?: string
  state?: string
  zip?: string | number
}

const createAddress = (address: SmartZipAddress): string => {
  return Object.keys(address).reduce((s, key) => {
    return address[key] !== undefined ? `${s} ${address[key]}` : s
  }, '')
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const { address, street, state, city, zip } = validator.validated.data
  const url = `addresses/suggest.json`

  const params = {
    address: address || createAddress({ street, state, city, zip }),
    api_key: config.apiKey,
  }

  if (!params.address)
  {
    throw new AdapterError({
      jobRunID,
      message: `Invalid address: ${params.address}`,
      statusCode: 400,
    })
  }

  const options = { ...config.api, params, url }

  // When a single result is returned from the SmartZip API, the properties object
  // will follow the structure of a single property:
  //    properties: { address: string, id: number }
  // When multiple properties are found by the search, the properties object will
  // become a list property objects:
  //    properties: [ 
  //      { address: string, id: number },
  //      ...
  //      { address: string, id: number }
  //    ]
  const response = await Requester.request(options, customError)
  const { response_code, properties } = response.data
  
  if (response_code !== 'SUCCESS')
  {
    throw new AdapterError({
      jobRunID,
      message: `SmartZip API response ${response_code}`,
      statusCode: 400,
    })
  } else if (Array.isArray(properties))
  {
    throw new AdapterError({
      jobRunID,
      message: `SmartZip API returned ${properties.length} results, expected 1`,
      statusCode: 400,
    })
  }

  // Return the SmartZip property id
  response.data.result = Requester.validateResultNumber(properties, ['id'])

  return Requester.success(jobRunID, response, config.verbose)
}
