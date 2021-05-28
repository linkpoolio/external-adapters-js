import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig } from '@chainlink/types'

export const NAME = 'addresses-suggest'

const customError = (data: any) => data.Response === 'Error'

const customParams = {
  street: true,
  city: false,
  state: false,
  zip: false,
}

interface SmartZipAddress {
  [index: string]: string | number | undefined
  street: string
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
  const { street, state, city, zip } = validator.validated.data
  const url = `addresses/suggest.json`

  const params = {
    address: createAddress({ street, state, city, zip }),
    api_key: process.env.API_KEY || config.apiKey,
  }

  const options = { ...config.api, params, url }

  const response = await Requester.request(options, customError)
  console.log(response)
  response.data.result = Requester.validateResultNumber(response.data.analytics, ['avm'])

  return Requester.success(jobRunID, response, config.verbose)
}
