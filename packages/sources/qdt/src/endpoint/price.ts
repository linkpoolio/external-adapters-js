import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig } from '@chainlink/types'

export const NAME = 'price'

const customError = (data: any) => data.Response === 'Error'

const customParams = {
  // note: api only supports BTC as of 2021-07-02
  symbol: false,
  n_days: false,
  // The counted days starting from today the user wants the result for.
  // Options 0 - 12
  days: true
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  // note: use when more symbols are supported
  // const symbol = validator.validated.data.symbol || 'BTC'
  const symbol = 'BTC'
  // note: use when more symbols are supported
  // const n_days = validator.validated.data.n_days || 1
  const n_days = 1

  const days = parseInt(validator.validated.data.days) || 0

  if (days < 0 || 12 < days) {
    throw new Error(`day must be between 0 and 12, received ${days}`)
  }

  const url = `/chainlink_api`

  const params = {
    symbol,
    n_days
  }

  config.api.headers['qml-api-key'] = config.apiKey

  const options = { ...config.api, params, url }

  const response = await Requester.request(options, customError)
  // timestamp is when api request was made
  const { prediction } = response.data[0] // { time, prediction }
  const { close_predict_delta } = prediction[0] // { time, close_predict_delta }

  if (close_predict_delta.length <= 12) {
    throw new Error(`Prediction array length too short. Length: ${close_predict_delta.length}`)
  }
  // Compute the selected index for the prediction array
  const idx = days + (close_predict_delta.length - 12)

  if (idx >= close_predict_delta.length) {
    throw new Error(`Prediction index out of bounds. Index: ${idx}`)
  }

  response.data.result = close_predict_delta[idx][1].close

  return Requester.success(jobRunID, response, config.verbose)
}
