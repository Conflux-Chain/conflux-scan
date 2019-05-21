# Conflux Scan V2.0 API

- [Conflux Scan API Template](#conflux-scan-api-template)
- [Conflux Scan API Reference](#conflux-scan-api-reference)
  - [block_list](#block_list)
    - [Parameters](#parameters)
    - [Example Parameters](#example-parameters)
    - [Returns](#returns)
    - [Example](#example)

## Conflux Scan API Template

#### return templater

1. `code` - error code
2. `message` - api message
3. `result` - api return result

## Conflux Scan API Reference

***

#### block_list

Returns the block data - GET

##### Parameters
1. `startTime` - Start Time, 13位时间戳
2. `endTime` - End Time, 13位时间戳, 时间间隔不超过一周
3. `pageNum` - pageNum, 从1开始

##### Example Parameters
```js
params: {
  startTime: 1558408468903,
  endTime: 1558412347639,
  pageNum: 1
}
```

##### Returns

`data` - The block array.
1. `deferredReceiptsRoot`
2. `deferredStateRoot`
3. `difficulty`
4. `epochNumber`
5. `gasLimit`
6. `hash`
7. `height`
8. `isPivot`
9. `miner`
10. `nonce`
11. `parentHash`
12. `refereeHashes`
13. `size`
14. `timestamp`
15. `transactionSize`
16. `transactionsRoot`

`pageInfo` - The block array.
1. `pageNum`
2. `total`

##### Example
```js

// Result
data: [
  {
    deferredReceiptsRoot: "0x0e316395da6ad46a5ce5034ac53347e916696f854c09eaf63f905bf1d4db4198"
    deferredStateRoot: "0x1bc71c5f5ec4666af5c12d7b3beec2989aaba078d509e3a116285804d670f1d3"
    difficulty: "197131992"
    epochNumber: 71994
    gasLimit: 3000000000
    hash: "0xd978a5ad555dbd47e091dab02c795b662bd86c745215745d91a48b92ecabbe5e"
    height: 71994
    isPivot: true
    miner: "0x000000000000000000000000000000000000001a"
    nonce: "0xefb97a0a12bce4c3"
    parentHash: "0xc0f8cf505f6dac69046e7da2b0ba30d87fac60d12273ef5ec4380d83d6e91e11"
    refereeHashes: ["0xd9588ff03628909e2d640750a0a3a5655227d403d7d1b1d90d6aa0c3db1e208d",…]
    0: "0xd9588ff03628909e2d640750a0a3a5655227d403d7d1b1d90d6aa0c3db1e208d"
    1: "0x55acf2d25b8bf625d661036055ede2af3ac2b4de79f05b0bbd1b39f91663e353"
    size: 450432
    timestamp: 1558329858
    transactionSize: 1173
    transactionsRoot: "0x98d8fded38d30c3ed3939f36dd0ee570039bc2b1c9161b5fcf0bbc1e18b3c3a4"
  }, {
    deferredReceiptsRoot: "0x3b1cbe78a9ec6507d76a377c7417603c2ef19bd53191ef5a54990d9ec2b438d9"
    deferredStateRoot: "0x98a06f54f838cf5697d86073d4b4f9b4afb0e199c2e2fe0914dac94a252989e9"
    difficulty: "197131992"
    epochNumber: 71994
    gasLimit: 3000000000
    hash: "0xd9588ff03628909e2d640750a0a3a5655227d403d7d1b1d90d6aa0c3db1e208d"
    height: 71992
    isPivot: false
    miner: "0x0000000000000000000000000000000000000013"
    nonce: "0xe051ddd9593259d0"
    parentHash: "0x9bd0bb0ee0f62c47758a529696d179e763630b7de582aaaae5991ce2a5decee9"
    refereeHashes: []
    size: 2845056
    timestamp: 1558329851
    transactionSize: 7409
    transactionsRoot: "0x4dad36acdcd6cf50802b2426a0aee335c8cb933d9c0a8d18747fc7fb83ef1fde"
  }
],
pageInfo: {
  pageNum: 1,
  total: 80408
}
```

***