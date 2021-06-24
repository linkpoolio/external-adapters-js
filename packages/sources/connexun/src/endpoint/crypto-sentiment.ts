import { Requester, Validator, AdapterError } from '@chainlink/ea-bootstrap'
import { AdapterRequest, AdapterResponse, Config } from '@chainlink/types'

export const NAME = 'crypto-sentiment'

const customError = (data: any) => data.Response === 'Error'

const validTokens = ['ADA', 'BCH', 'BNB', 'BTC', 'DOGE', 'DOT', 'EOS', 'ETC', 'ETH', 'FIL', 'ICP', 'LTC', 'MATIC', 'SOL', 'THETA', 'TRX', 'VET', 'XLM', 'XMR', 'XRP']
const validPeriods = [1, 6, 12, 24]

const customParams = {
  token: false,
  period: false,
}

export const execute = async (request: AdapterRequest, config: Config): Promise<AdapterResponse> => {
  const validator = new Validator(request, customParams)

  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  let { token } = validator.validated.data || 'average sentiment value for crypto news'
  const { period } = validator.validated.data || 12

  if (token) {
    token = token.toUpperCase()

    if (!validTokens.includes(token)) {
      throw new AdapterError({
        jobRunID,
        statusCode: 400,
        message: `Invalid token parameter value`,
      })
    }
  }

  if (period && !validPeriods.includes(period)) {
    throw new AdapterError({
      jobRunID,
      statusCode: 400,
      message: `Invalid period parameter value`,
    })
  }

  const url = `/data/sentiments/crypto`

  const params = {
    token,
    period
  }

  const options = {
    ...config.api,
    url,
    params
  }

  const response = await Requester.request(options, customError)

  // Response will come back as a string with a value between -1 and 1
  const x = Number(response.data) * 10 ** 4
  response.data = {
    result: x
  }

  return Requester.success(jobRunID, response, config.verbose)
}
