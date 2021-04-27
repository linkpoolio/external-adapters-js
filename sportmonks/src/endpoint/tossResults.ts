import { Requester, Validator } from '@chainlink/external-adapter'
import { ExecuteWithConfig, Config } from '@chainlink/types'

export const NAME = 'toss-results'

const customParams = {
  round: true,
  season_id: false,
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const round = validator.validated.data.round
  const season_id = validator.validated.data.season_id || 708
  const url = `fixtures/`

  const params = {
    'filter[season_id]': season_id,
    include: 'tosswon',
    api_token: config.apiKey,
  }

  const options = { ...config.api, params, url }
  const response = await Requester.request(options)

  const match = response.data.data.find((entry: { round: string }) => entry.round === round)
  let result = null

  if (match.status !== 'Finished') {
    return Requester.errored(jobRunID, 'Match has not finished')
  } else if (match.toss_won_team_id === match.localteam_id) {
    result = 'home'
  } else if (match.toss_won_team_id === match.visitorteam_id) {
    result = 'away'
  }

  return Requester.success(jobRunID, {
    data: config.verbose ? { ...response.data, result } : { result },
    result,
    status: 200,
  })
}
