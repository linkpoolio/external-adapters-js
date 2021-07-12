import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, Config } from '@chainlink/types'

export const NAME = 'atm-iv'

const customError = (data: any) => data.Response === 'Error'

const customParams = {
  symbol: true,
  daysOut: true,
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const symbol = validator.validated.data.symbol
  const daysOut = validator.validated.data.daysOut

  const options = {
    ...config.api,
    baseURL: config.api.radarSaasEndpoint,
    method: 'post',
    data: {
      instrumentCategory: 'UNDERLYING',
      datapoints: [
        {
          expr: 'symbol',
        },
        {
          expr: `atmIv(daysToExp=${daysOut})`,
        },
      ],
      filters: [
        {
          datapoint: 0,
          alternatives: [
            {
              predicate: 'anyOf',
              args: [`${symbol}USD:CXXDRB`],
            },
          ],
        },
      ],
      outputs: [
        {
          datapoint: 1,
        },
      ],
    },
  }

  const response = await Requester.request(options, customError)
  response.data.result = Requester.validateResultNumber(response.data, ['entries', 0, 'outputs', 0])
  return Requester.success(jobRunID, response, config.verbose)
}
