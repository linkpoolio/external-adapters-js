# Chainlink External Adapter for SmartZip

Use SmartZip's API to retrieve the value of a home.

### Environment Variables

| Required? |  Name   |                            Description                             | Options | Defaults to |
| :-------: | :-----: | :----------------------------------------------------------------: | :-----: | :---------: |
|     ✅     | API_KEY | An API key that can be obtained from the data provider's dashboard |         |             |

---

### Input Parameters

| Required? |   Name   |   Description    |                               Options                                | Defaults to |
| :-------: | :------: | :--------------: | :------------------------------------------------------------------: | :---------: |
|     ✅     | endpoint | Adapter endpoint | [property-avm](#Property-AVM), [property-details](#Property-Details) |             |

---

## Property AVM

Returns the AVM price of a property by address.

### Input Params

The endpoint prioritizes the `address` paramter, otherwise, if no `address` is
passed, one will attempt to be created from the passed `street`, `city`, 
`state`, and `zip`.

When passing or creating an address, the minimum amount of data to isolate a
single address is all that is needed. For example, `1200 broadway XXXXX` is
sufficient enough without a state and zip code to return a single result.

| Required? |  Name   |   Description    |    Options     | Defaults to |
| :-------: | :-----: | :--------------: | :------------: | :---------: |
|           | address | Property address |     string     |  undefined  |
|           | street  | Property street  |     string     |  undefined  |
|           |  city   |  Property city   |     string     |  undefined  |
|           |  state  |  Property state  |     string     |  undefined  |
|           |   zip   |   Property zip   | string, number |  undefined  |

---

## Property Details

Returns the AVM price of a property by a given SmartZip property ID.

### Input Params

| Required? |     Name      |                 Description                 | Options | Defaults to |
| :-------: | :-----------: | :-----------------------------------------: | :-----: | :---------: |
|     ✅     | `property_id` | The ID of the property assigned by SmartZip | number  |  undefined  |


### Sample Input

NOTE: that `XXXXX` is meant to be a real zip code.

```json
{
  "id": "1",
  "data": {
    "endpoint": "property-avm",
    "address": "1200 broadway XXXXX"
  }
}
```

```json
{
  "id": "1",
  "data": {
    "endpoint": "property-avm",
    "street": "1200 broadway",
    "zip": "XXXXX"
  }
}
```

### Sample Output

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "price": 1197100,
    "result": 1197100
  },
  "statusCode": 200
}
```