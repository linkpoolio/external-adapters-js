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
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "_home",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "_away",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "_timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_ipfsHash",
        "type": "bytes32"
      }
    ],
    "name": "createCondition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]