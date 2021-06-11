import { Requester, Validator, AdapterError } from '@chainlink/ea-bootstrap'
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
  team: true, // Options: any string to filter teams against
  live: false, // Options: true, false, though any truthy value will work; Default: false
}

export type SportsDataSportsbook = {
  GameOddId: number
  Sportsbook: string
  GameId: number
  Created: Date
  Updated: Date
  HomeMoneyLine: number | null
  AwayMoneyLine: number | null
  DrawMoneyLine: number | null
  HomePointSpread: number | null
  AwayPointSpread: number | null
  HomePointSpreadPayout: number | null
  AwayPointSpreadPayout: number | null
  OverUnder: number | null
  OverPayout: number | null
  UnderPayout: number | null
  SportsbookId: number | null
  SportsbookUrl: string | null
  HomeTeamAsianHandicap: number | null
  AwayTeamAsianHandicap: number | null
  HomeTeamAsianHandicapPayout: number | null
  AwayTeamAsianHandicapPayout: number | null
  AsianTotal: number | null
  AsianTotalOverPayout: number | null
  AsianTotalUnderPayout: number | null
}

export type SportsDataSoccerGame = {
  GameId: number
  RoundId: number
  Season: number
  SeasonType: number
  Week: number | null
  Day: Date
  DateTime: Date
  Status: string // Final | Postponed | ...
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
  PregameOdds: [SportsDataSportsbook]
  LiveOdds: [SportsDataSportsbook]
}

// Nullable odd
export type Nodd = number | null
// Unfiltered odds could have a null value
export type Nodds = Nodd[]
// Home, Tie, Away
export type Odds = number[]

/**
 * Has Soccer Team Name filter
 *
 * @param name The name checked against the home and away teams.
 * @return Function used to test iterated SportsDataSoccerOdds instance against passed name.
 */
const hasSoccerTeamName = (name: string) => (game: SportsDataSoccerGame) => {
  let needle = name.toLowerCase()
  return (
    game.AwayTeamName.toLowerCase().includes(needle) ||
    game.HomeTeamName.toLowerCase().includes(needle)
  )
}

const pickMoneyLines = ({
  HomeMoneyLine,
  AwayMoneyLine,
  DrawMoneyLine,
}: SportsDataSportsbook): Nodds => [HomeMoneyLine, AwayMoneyLine, DrawMoneyLine]

const oddsFromNodds = (nodd: Nodds): nodd is Odds => nodd.every((o) => o !== null)

const sortByFirstValue = (a: Odds, b: Odds) => a[0] - b[0]

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  if (!config.soccerOddsKey) {
    throw new Error('config.soccerOddsKey is empty')
  }

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
    `/soccer/odds/json/` +
    (live ? `LiveGameOddsByDate/${date}` : `PreGameOddsByDateByCompetition/${league}/${date}`)

  const params = {
    key: config.soccerOddsKey,
  }

  const options = { ...config.api, params, url }

  const response = await Requester.request(options)

  /* Filter the odds data by home and away team names if a team name was passed.
    The result key will contain the filtered list, while the data key will 
    remain untouched. */
  const games = response.data.filter(hasSoccerTeamName(team))

  if (games.length !== 1) {
    throw new AdapterError({
      jobRunID,
      message: `Expected game count to be 1 (count => ${games.length})`,
      statusCode: 406,
    })
  } else if (!live && games[0].PregameOdds.length === 0) {
    throw new AdapterError({
      jobRunID,
      message: `No pregame odds found`,
      statusCode: 406,
    })
  } else if (live && games[0].LiveOdds.length === 0) {
    throw new AdapterError({
      jobRunID,
      message: `No live game odds found`,
      statusCode: 406,
    })
  }

  const gameOdds = live ? games[0].LiveOdds : games[0].PregameOdds

  // [{A...G}0,...,{A...G}n-1] =>
  const odds: Odds[] = gameOdds
    .map(pickMoneyLines) // [[A,B,C]0?,...,[A,B,C]n-1?] =>
    .filter(oddsFromNodds) //  [[A,B,C]0,...,[A,B,C]n-1] =>
    .sort(sortByFirstValue) // [[A,B,C] <=...<=[A,B,C]]

  const getMedian = (arr: Odds[]): Odds => {
    const mid = Math.floor(arr.length / 2)

    if (arr.length % 2) return arr[mid]

    return arr[mid - 1].map((num, idx) => {
      return (num + arr[mid][idx]) / 2
    })
  }

  response.data.result = getMedian(odds).map((odd: number) => odd * 10)

  return Requester.success(jobRunID, response, config.verbose)
}
