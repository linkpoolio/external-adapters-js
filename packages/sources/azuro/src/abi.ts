export const packedAbi = [
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "createCondition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "resolveCondition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "oracleConditionID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rate1_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rate2_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "ipfsHash",
        "type": "bytes32"
      }
    ],
    "name": "createCondition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "conditionID_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "outcomeWin_",
        "type": "uint256"
      }
    ],
    "name": "resolveCondition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
