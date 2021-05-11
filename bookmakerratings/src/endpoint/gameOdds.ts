import { Requester, Validator } from '@chainlink/external-adapter'
import { ExecuteWithConfig, Config } from '@chainlink/types'

type BookmakerGameId = number

type BookmakerTeamOdds = [number, number, number, number, number, [[], [[number]]], string, number]

interface BookmakerGameOdds {
  [index: string]: BookmakerTeamOdds
}

type BookmakerOdds = [BookmakerGameId, number, number, BookmakerGameOdds, null, [], [], [], number]
type BookmakerOddsResponse = { odds: [BookmakerOdds]; externalRbIds: { [index: string]: number } }
export const NAME = 'game-odds'

const customParams = {
  gameIds: true,
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const gameIds = validator.validated.data.gameIds
  const authUsername = process.env.AUTH_USERNAME
  const authPassword = process.env.AUTH_PASSWORD
  const url = `odds.json`

  const params = {
    gameIds,
  }

  const options = {
    ...config.api,
    method: 'post',
    params,
    url,
    auth: {
      username: authUsername,
      password: authPassword,
    },
    data: {
      gameIds: [1600237],
      marketRegistryIds: [9],
      gameVarietyIds: [1],
      gameTypeIds: [1],
      gamePeriodNumbers: [0],
      bookmakerIds: [1],
      flags: 16,
    },
  }

  const response = await Requester.request(options)
  const { data }: { data: BookmakerOddsResponse } = response
  const result = Object.values(data.odds[0][3]).map((odd: BookmakerTeamOdds) => odd[5][1][0])

  return Requester.success(jobRunID, {
    data: config.verbose ? { ...response.data, result } : { result },
    result,
    status: 200,
  })
}
