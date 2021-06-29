# Chainlink External Adapter for Azuro

Sports predictive markets

### Environment Variables

| Required? |  Name   |                                                        Description                                                         | Options | Defaults to |
| :-------: | :-----: | :------------------------------------------------------------------------------------------------------------------------: | :-----: | :---------: |
|   ✅         | API_KEY | Oauth bearer token  |         |             |

---

### Input Parameters

| Required? |   Name   |     Description     |           Options            | Defaults to |
| :-------: | :------: | :-----------------: | :--------------------------: | :---------: |
|      ✅      | endpoint | The endpoint to use | `open`, `settle` |   -   |

---

## Open and Settle Endpoint

Open endpoint returns the events that need to be made on chian and settle returns the events that need to be closed
on chain.

### Sample Input

```json
{
  "id": "1",
  "data": {
    "endpoint": "open"
  }
}
```

### Sample Output

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": [12383020, 800, 1200, 1625006815, "mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a"],
  "result": [12383020, 800, 1200, 1625006815, "mtwirsqawjuoloq2gvtyug2tc3jbf5htm2zeo4rsknfiv3fdp46a"],
  "statusCode": 200
}
```
