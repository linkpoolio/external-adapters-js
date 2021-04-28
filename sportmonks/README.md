# Chainlink External Adapter for SportMonks

### Environment Variables

| Required? |  Name   |                                      Description                                      | Options | Defaults to |
| :-------: | :-----: | :-----------------------------------------------------------------------------------: | :-----: | :---------: |
|    ✅     | API_KEY | An API key that can be obtained from the data [provider](https://www.sportmonks.com/) |         |             |

---

### Input Parameters

| Required? |   Name   |     Description     |                                     Options                                      |  Defaults to  |
| :-------: | :------: | :-----------------: | :------------------------------------------------------------------------------: | :-----------: |
|           | endpoint | The endpoint to use | [match-results](#Match-Results-Endpoint), [toss-results](#Toss-Results-Endpoint) | match-results |

---

## Match Results Endpoint

Returns the winning team of a specific match

### Input Params

| Required? |    Name     |          Description          | Options | Defaults to |
| :-------: | :---------: | :---------------------------: | :-----: | :---------: |
|    ✅     |   `round`   |      The round to query       |         |             |
|           | `season_id` | The id of the season to query |         |    `708`    |

### Sample Input

```json
{
  "id": "1",
  "data": {
    "round": "1st Match",
    "season_id": "708"
  }
}
```

### Sample Output

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "data": [
      {
        "resource": "fixtures",
        "id": 24915,
        "league_id": 1,
        "season_id": 708,
        "stage_id": 2262,
        "round": "1st Match",
        "localteam_id": 6,
        "visitorteam_id": 8,
        "starting_at": "2021-04-09T14:00:00.000000Z",
        "type": "T20",
        "live": true,
        "status": "Finished",
        "last_period": null,
        "note": "Royal Challengers Bangalore won by 2 wickets (With 0 ball remaining)",
        "venue_id": 58,
        "toss_won_team_id": 8,
        "winner_team_id": 8,
        "draw_noresult": null,
        "first_umpire_id": 326,
        "second_umpire_id": 158,
        "tv_umpire_id": 57,
        "referee_id": 734,
        "man_of_match_id": 2744,
        "man_of_series_id": null,
        "total_overs_played": 20,
        "elected": "bowling",
        "super_over": false,
        "follow_on": false,
        "localteam_dl_data": { "score": null, "overs": null, "wickets_out": null },
        "visitorteam_dl_data": { "score": null, "overs": null, "wickets_out": null },
        "rpc_overs": null,
        "rpc_target": null,
        "weather_report": []
      }
    ],
    "links": {
      "first": "https://cricket.sportmonks.com/api/v2.0/fixtures?page=1",
      "last": "https://cricket.sportmonks.com/api/v2.0/fixtures?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 1,
      "links": [Array],
      "path": "https://cricket.sportmonks.com/api/v2.0/fixtures",
      "per_page": 100,
      "to": 56,
      "total": 56
    },
    "result": "away"
  },
  "result": "away",
  "statusCode": 200
}
```

## Toss Results Endpoint

Returns the winning team of a specific toss

### Input Params

| Required? |    Name     |          Description          | Options | Defaults to |
| :-------: | :---------: | :---------------------------: | :-----: | :---------: |
|    ✅     |   `round`   |      The round to query       |         |             |
|           | `season_id` | The id of the season to query |         |    `708`    |

### Sample Input

```json
{
  "id": "1",
  "data": {
    "round": "1st Match",
    "season_id": "708"
  }
}
```

### Sample Output

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "data": [
      {
        "resource": "fixtures",
        "id": 24915,
        "league_id": 1,
        "season_id": 708,
        "stage_id": 2262,
        "round": "1st Match",
        "localteam_id": 6,
        "visitorteam_id": 8,
        "starting_at": "2021-04-09T14:00:00.000000Z",
        "type": "T20",
        "live": true,
        "status": "Finished",
        "last_period": null,
        "note": "Royal Challengers Bangalore won by 2 wickets (With 0 ball remaining)",
        "venue_id": 58,
        "toss_won_team_id": 8,
        "winner_team_id": 8,
        "draw_noresult": null,
        "first_umpire_id": 326,
        "second_umpire_id": 158,
        "tv_umpire_id": 57,
        "referee_id": 734,
        "man_of_match_id": 2744,
        "man_of_series_id": null,
        "total_overs_played": 20,
        "elected": "bowling",
        "super_over": false,
        "follow_on": false,
        "localteam_dl_data": { "score": null, "overs": null, "wickets_out": null },
        "visitorteam_dl_data": { "score": null, "overs": null, "wickets_out": null },
        "rpc_overs": null,
        "rpc_target": null,
        "weather_report": []
      }
    ],
    "links": {
      "first": "https://cricket.sportmonks.com/api/v2.0/fixtures?page=1",
      "last": "https://cricket.sportmonks.com/api/v2.0/fixtures?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 1,
      "links": [Array],
      "path": "https://cricket.sportmonks.com/api/v2.0/fixtures",
      "per_page": 100,
      "to": 56,
      "total": 56
    },
    "result": "away"
  },
  "result": "away",
  "statusCode": 200
}
```
