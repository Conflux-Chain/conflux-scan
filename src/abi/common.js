export default [
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'granularity',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  }, // 777
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ type: 'bytes4' }],
    outputs: [{ type: 'bool' }],
  }, // 721
  {
    type: 'event',
    name: 'Transfer',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
      },
    ],
  }, // 20, 721
  {
    anonymous: false,
    type: 'event',
    name: 'Sent',
    inputs: [
      {
        indexed: true,
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
      {
        name: 'data',
        type: 'bytes',
      },
      {
        name: 'operatorData',
        type: 'bytes',
      },
    ],
  }, // 777
];
