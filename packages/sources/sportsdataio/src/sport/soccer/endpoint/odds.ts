import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig } from '@chainlink/types'
import { Config } from '../../../config'

/**
 * API Documentation: https://sportsdata.io/developers/api-documentation/soccer#/aggregated-odds/pregame-odds-by-date-by-competition
 * SportsData docs favor the use of `competition` and has been replaced with
 * `league` in this codebase.
 */
export const NAME = 'odds'

// !important: use live parameter to retrieve in-game odds, otherwise pre-game odds will be used.
const customParams = {
  league: false, // Options: EPL, 1, MLS, 8; Default: MLS
  date: false, // Options: a date formatted in YYYY-MM-DD; Default: today's date
  team: false, // Options: any string to filter teams against
  live: false, // Options: true, false, though any truthy value will work; Default: false
}

export type SportsDataSoccerOdds = {
  GameId: number
  RoundId: number
  Season: number
  SeasonType: number
  Week: number | null
  Day: Date
  DateTime: Date
  Status: string
  AwayTeamId: number
  HomeTeamId: number
  AwayTeamName: string
  HomeTeamName: string
  GlobalGameId: number
  GlobalAwayTeamId: number
  GlobalHomeTeamId: number
  HomeTeamScore: number | null
  AwayTeamScore: number | null
  TotalScore: number | null
  PregameOdds: []
  LiveOdds: []
}

export type SportsDataSoccerOddsResponse = [SportsDataSoccerOdds]

/**
 * Has Soccer Team Name filter
 *
 * @param name The name checked against the home and away teams.
 * @return Function used to test iterated SportsDataSoccerOdds instance against passed name.
 */
const hasSoccerTeamName = (name: string) => (odds: SportsDataSoccerOdds) => {
  return (
    odds.AwayTeamName.toLowerCase().includes(name) || odds.HomeTeamName.toLowerCase().includes(name)
  )
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const {
    league = 'MLS',
    date = new Date().toISOString().split('T')[0],
    team,
    live = false,
  } = validator.validated.data

  // Get live game odds if `live` is a falsy value
  const url =
    `/soccer/odds/json/` + !!live
      ? `LiveGameOddsByDate/${date}`
      : `PreGameOddsByDateByCompetition/${league}/${date}`

  const params = {
    key: config.soccerKey,
  }

  const options = { ...config.api, params, url }

  const response = await Requester.request(options)

  /* Filter the odds data by home and away team names if a team name was passed.
    The result key will contain the filtered list, while the data key will 
    remain untouched. */
  response.data.result = team ? response.data.filter(hasSoccerTeamName(team)) : response.data

  return Requester.success(jobRunID, response, config.verbose)
}
