# Chainlink External Adapter for Stats Perform

[Stats Perform](https://www.statsperform.com/)


### Environment Variables

| Required? |  Name   |                                                        Description                                                         | Options | Defaults to |
| :-------: | :-----: | :------------------------------------------------------------------------------------------------------------------------: | :-----: | :---------: |
|      ✅       | API_KEY | An API key that can be obtained from the data provider's dashboard  |         |             |
|      ✅       | SECRET | A shared secret that can be obtained from the data provider's dashboard  |         |             |

---

### Input Parameters

| Required? |   Name   |     Description     |           Options            | Defaults to |
| :-------: | :------: | :-----------------: | :--------------------------: | :---------: |
|      ✅        | endpoint | The endpoint to use | [medals](#Medals-Endpoint) |   example   |

---

## Medals Endpoint

Returns the top three (3) countries in descending order by overall medal count. Can optionally sort by gold medal count.

### Input Params

| Required? |            Name            |               Description                |       Options       | Defaults to |
| :-------: | :------------------------: | :--------------------------------------: | :-----------------: | :---------: |
|        | `season`  |   The Olympic season to use   | `YYYY` |  Current Season           |
|         | `sortType` | The type of medal to sort by | `gold` | Overall medal count            |

### Sample Input

```json
{
  "id": "1",
  "data": {
    "endpoint": "medals",
    "season": 2016
  }
}
```

### Sample Output

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "result": ["USA", "CHN", "GBR"]
  },
  "result": ["USA", "CHN", "GBR"],
  "statusCode": 200
}
```
