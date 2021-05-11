import { Requester, Validator } from '@chainlink/external-adapter'
import { ExecuteWithConfig, Config } from '@chainlink/types'

type BookmakerLeage = {
  leagueId: number
  leagueName: string
  countryId: string | null
}

export const NAME = 'leagues'

const customParams = {
  sportIds: true,
}

export const execute: ExecuteWithConfig<Config> = async (req, config) => {
  const validator = new Validator(req, customParams)
  const { validated, error } = validator

  if (error) throw error

  const {
    id,
    data: { sportIds },
  } = validated

  const options = {
    ...config.api,
    method: 'get',
    params: {
      sportIds,
    },
    url: 'leagues.json',
    auth: {
      username: process.env.AUTH_USERNAME,
      password: process.env.AUTH_PASSWORD,
    },
  }

  const { data }: { data: [BookmakerLeage] } = await Requester.request(options)

  // TODO: finalize result data transformations
  const result = data

  return Requester.success(id, {
    data: config.verbose ? { ...data, result } : { result },
    result,
    status: 200,
  })
}
