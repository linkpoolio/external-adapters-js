export const abi = [
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '_id',
        type: 'uint32',
      },
      {
        internalType: 'int256',
        name: '_home',
        type: 'int256',
      },
      {
        internalType: 'int256',
        name: '_away',
        type: 'int256',
      },
      {
        internalType: 'uint32',
        name: '_timestamp',
        type: 'uint32',
      },
      {
        internalType: 'bytes32',
        name: '_ipfsHash',
        type: 'bytes32',
      },
    ],
    name: 'createCondition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]