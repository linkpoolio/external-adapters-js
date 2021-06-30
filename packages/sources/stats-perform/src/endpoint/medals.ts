import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig } from '@chainlink/types'
import { createHash } from 'crypto'

export const NAME = 'medals'

const customError = (data: any) => data.Response === 'Error'

const customParams = {
  season: false,
  sortType: false
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const { apiKey, secret } = config
  const timeFromEpoch = Math.floor(new Date().getTime() / 1000)
  const jobRunID = validator.validated.id
  const season = validator.validated.data.season
  // Default sort is by overall medals, otherwise `gold` is an option
  let sortType = validator.validated.data.sortType

  const url = `/v1/stats/oly/smr_oly/medals/`
  const sig = createHash('sha256').update(apiKey + secret + timeFromEpoch).digest('hex')

  let params = {
    sig,
    season,
    api_key: apiKey
  }

  if (sortType) {
    const validSortTypes = ['gold']
    sortType = sortType.toLowerCase()

    if (!validSortTypes.includes(sortType)) {
      throw new Error(`sortType ${sortType} is unsupported`)
    }

    params.sortType = sortType
  }

  const options = { ...config.api, params, url }
  const response = await Requester.request(options, customError)

  const { apiResults } = response.data
  const [olympics] = apiResults
  const { medals } = olympics.league
  const abbrs = medals.map(m => m.olympicCountry.abbreviation)

  response.data.result = [abbrs[0], abbrs[1], abbrs[2]]

  return Requester.success(jobRunID, response, config.verbose)
}
