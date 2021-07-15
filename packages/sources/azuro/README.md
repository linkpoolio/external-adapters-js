# Chainlink External Adapter for Azuro

Sports predictive markets

### Environment Variables

| Required? |    Name     |              Description               | Options | Defaults to |
| :-------: | :---------: | :------------------------------------: | :-----: | :---------: |
|    ✅     |   API_KEY   |           Oauth bearer token           |         |             |
|    ✅     |   RPC_URL   |          RPC endpoint to use           |         |             |
|    ✅     | PRIVATE_KEY | Private key of signer for transactions |         |             |

---

### Input Parameters

| Required? |      Name       |                    Description                     |     Options      | Defaults to |
| :-------: | :-------------: | :------------------------------------------------: | :--------------: | :---------: |
|    ✅     |    endpoint     |                The endpoint to use                 | `open`, `settle` |      -      |
|    ✅     | contractAddress |         The address to send transaction to         | A valid address  |      -      |
|           |     packed      | Flag for switching between packed and unpacked api | `true`, `false`  |   `false`   |

---

## Open and Settle Endpoint

Returns the event transactions that were successfully executed on chain.

### Sample Input

```json
{
  "id": "1",
  "data": {
    "endpoint": "open",
    "contractAddress": "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF"
  }
}
```

### Sample Output

```json
{
  "jobRunID": "1",
  "data": {
    "result": [
      {
        "txHash": "0xa8016d7a3b290678efcf0dd32ee413f02e4a3b5664957002641dc5d718adadff",
        "id": 172636283
      }
    ]
  },
  "result": [
    {
      "txHash": "0xa8016d7a3b290678efcf0dd32ee413f02e4a3b5664957002641dc5d718adadff",
      "id": 172636283
    }
  ],
  "statusCode": 200
}
```
