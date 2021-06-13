# Chainlink External Adapter for SportsDataIO



### Environment Variables

| Required? |        Name        |                Description                | Options | Defaults to |
| :-------: | :----------------: | :---------------------------------------: | :-----: | :---------: |
|           | NFL_SCORES_API_KEY | An API key that gives access to NFL data  |         |             |
|           | MMA_SCORES_API_KEY | An API key that gives access to MMA data  |         |             |
|           |   SOCCER_API_KEY   | An API key required to access Soccer data |         |             |

---

### Input Parameters

| Required? |   Name   |     Description     |     Options      | Defaults to |
| :-------: | :------: | :-----------------: | :--------------: | :---------: |
|     ✅     |  sport   | The endpoint to use | nfl, mma, soccer |      -      |
|           | endpoint | The endpoint to use |                  |   example   |

---

## SportsDataIO Soccer

| Required? |   Name   |     Description     | Options | Defaults to |
| :-------: | :------: | :-----------------: | :-----: | :---------: |
|     ✅     | endpoint | The endpoint to use |  odds   |      -      |

### Odds - Input Params

| Required? |  Name  |                        Description                        |    Options     | Defaults to |
| :-------: | :----: | :-------------------------------------------------------: | :------------: | :---------: |
|           | `date` |     The date of the Soccer event in YYYY-MM-DD format     |  A valid date  |    Today    |
|           | `live` |                Used to retrieve live data                 |      true      |    false    |
|           | `team` | Filter results to team names only including passed string | A valid string |      -      |

### Sample Input

```json
{
  "id": "1",
  "data": {
    "sport": "soccer",
    "endpoint": "odds",
    "live": true,
    "team": "new york"
  }
}
```

### Sample Output

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "odds": [
      // array of all games for today (since no date was passed in example above)
    ],
    "result": [
      // array of games with home or away team name's including "new york"
    ]
  },
  "statusCode": 200
}
```

### Local Container Testing

```sh
# All commands executed from root directory
$ yarn && yarn setup && yarn generate:docker-compose
# Build docker container
$ docker-compose -f docker-compose.generated.yaml build sportsdataio-adapter
# Check adapter image tag
$ docker image ls | grep sportsdataio-adapter
# create .env file and add necessary api key information
# Run container. Docker compose will automatically load .env files (as of version 1.28) at the base of project directory
$ docker-compose -f docker-compose.generated.yaml run -p 8080:8080 sportsdataio-adapter
# Emulate chainlink request via curl
# No date is likely to return an empty result
$ curl -s -i -X POST -H "Content-Type: application/json" -d '{"id":"1","data":{"sport":"soccer","endpoint":"odds"}}' localhost:8080
# Request with date providing non-empty result
$ curl -s -i -X POST -H "Content-Type: application/json" -d '{"id":"1","data":{"sport":"soccer","endpoint":"odds","date":"2021-06-19"}}' localhost:8080
# Filter result data down to matches with team names containing "new york"
$ curl -s -i -X POST -H "Content-Type: application/json" -d '{"id":"1","data":{"sport":"soccer","endpoint":"odds","date":"2021-06-19","team":"new york"}}' localhost:8080
# Get live game odds (minimum requirements)
$ curl -s -i -X POST -H "Content-Type: application/json" -d '{"id":"1","data":{"sport":"soccer","endpoint":"odds","live":"true"}}' localhost:8080
# Get live game odds (note: using historical date to ensure non-empty score data)
$ curl -s -i -X POST -H "Content-Type: application/json" -d '{"id":"1","data":{"sport":"soccer","endpoint":"odds","date":"2021-06-06", "live":"true"}}' localhost:8080
# Live game odds with team name filter
$ curl -s -i -X POST -H "Content-Type: application/json" -d '{"id":"1","data":{"sport":"soccer","endpoint":"odds","date":"2021-06-06", "live":"true","team":"greece"}}' localhost:8080

# Get NFL regular season data for 2019
$ curl -s -i -X POST -H "Content-Type: application/json" -d '{"id":"1","data":{"sport":"nfl","endpoint":"scores","season":"2019REG"}}' localhost:8080
```