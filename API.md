# Conflux Scan V2.0 API

- [Global Contract](#global-contract)
- [API Reference](#api-reference)
  - [Dashboard Statistics](#dashboard-statistics)
  - [Dashboard Line Chart](#dashboard-line-chart)
  - [Block Detail](#block-detail)
  - [Block Detail Transaction List](#block-detail-tx-list)
  - [Block list](#block-list)
  - [Tx Detail](#tx-detail)
  - [Tx List](#tx-list)
  - [Account Detail](#account-detail)
  - [Account Tx List (S/R Merge))](#account-tx-list)
  - [Account Block List](#account-block-list)

## Global Contract

### Overview

- All data is sent and received as JSON
- All timestamps return in 10 / 13 digit int: `1558329858`

### Request

- `Content-Type`: `application/json; charset=utf-8`

### Response Format

| Name | Type | Description |
| :--- | :--: | :--- |
| `code` | `int` | Error code |
| `message` | `string` | Error Message |
| `result` | `object` | Return result data |

### Authorization

`NONE`

## API Reference

#### Dashboard Statistics

```js
path: /dashboard/statistics
method: 'get'
params: {}
result: {
  data: {
    'tps': { // tps/difficulty/blockTime/hashRate
      val: num,
      trend: num
  }, ...}
}
```

#### Dashboard Line Chart

```js
path: /dashboard/statistics/:name // tps/difficulty/blockTime/hashRate
method: 'get'
params: {
  duration: '' // hour/day/month/all
}
result: {
  data: [{
    time: num, // 10bit
    value: num
  }, ...]
}
```

#### Block Detail

```js
path: /block/:blockHash
method: 'get'
params: {}
result: {
  data: {
    epochNumber: num,
    position: num,
    hash: 'hash',
    difficulty: 'num',
    miner: 'hash',
    gasLimit: num,
    timestamp: num, // 10bit
    transactionSize: num, // Tx count
    //
    deferredReceiptsRoot: 'hash',
    deferredStateRoot: 'hash',
    height: num,
    isPivot: bool,
    nonce: 'hash',
    parentHash: 'hash',
    refereeHashes: [],
    size: num,
    transactionsRoot: 'hash'
  }
}
```

#### Block Detail Transaction List

```js
path: /block/:blockHash/transactionList
method: 'get'
params: {
  pageNum: 1 // num | 页码
  pageSize: 10 // num | 每页展示数
}
result: {
  total: num, // 总数
  data: [{
    blockHash: 'hash',
    from: 'hash',
    to: 'hash',
    value: '',
    gasPrice: 'num',
    timestamp: num, // 10bit
    contractCreated: ,
    data: '',
    // isPivot: bool, // Tx 无 Pivot 
    epochNumber: num,
    gas: num,
    hash: 'hash',
    nonce: num,
    r: 'hash',
    s: 'hash',
    transactionIndex: num,
    v: num,
  }, ...]
}
```

#### Block List

```js
path: /block/list
method: 'get'
params: {
  epochNum: num, // 可选
  pageNum: 1 // num | 页码
  pageSize: 10 // num | 每页展示数
}
result: {
  code: // 0 | 1
  msg:  //
  result: {
    total: num, // 总数
    data: [{
      epochNumber: num,
      position: num,
      hash: 'hash',
      difficulty: 'num',
      miner: 'hash',
      gasLimit: num,
      timestamp: num, // 10bit
      transactionSize: num, // Tx count
      //
      deferredReceiptsRoot: 'hash',
      deferredStateRoot: 'hash',
      height: num,
      isPivot: bool,
      nonce: 'hash',
      parentHash: 'hash',
      refereeHashes: [],
      size: num,
      transactionsRoot: 'hash'
    }, ...]
  }
}
```

#### Tx List


```js
path: /transaction/list
method: 'get'
params: {
  pageNum: 1 // num | 页码
  pageSize: 10 // num | 每页展示数
}
result: {
  code: // 0 | 1
  msg:  //
  result: {
    total: num, // 总数
    data: [{
      blockHash: 'hash',
      from: 'hash',
      to: 'hash',
      // value
      // gas price
      timestamp: num, // 10bit
      contractCreated: ,
      data: '',
      // isPivot: bool,
      epochNumber: num,
      gas: num,
      gasPrice: 'num',
      hash: 'hash',
      nonce: num,
      r: 'hash',
      s: 'hash',
      transactionIndex: num,
      v: num,
      value: '',
    }, ...]
  }
}
```

#### Tx Detail


```js
path: /transaction/:transactionHash
method: 'get'
params: {}
result: {
  code: // 0 | 1
  msg:  //
  result: {
    data: {
      blockHash: 'hash',
      from: 'hash',
      to: 'hash',
      value: '',
      gasPrice: 'num',
      timestamp: num, // 10bit
      contractCreated: ,
      data: '',
      // isPivot: bool,
      epochNumber: num,
      gas: num,

      hash: 'hash',
      nonce: num,
      r: 'hash',
      s: 'hash',
      transactionIndex: num,
      v: num,
    }
  }
}
```

#### Account Detail


```js
path: /account/:address
method: 'get'
params: {}
result: {
  code: // 0 | 1
  msg:  //
  result: {
    data: { 
      balance: "39998263999999999968857000" //39998264 CFX(Max) 10^9  Gdrip  Drip(Min)
      firstSeen: 1557924851
      lastSeen: 1558495563
      minedBlocks: 0
      receivedTransactions: 1
      sentTransactions: 1483
    }
  }
}
```

#### Account Tx List (S/R Merge)

```js
path: /account/:address/transactionList
method: 'get'
params: {
  startTime: 'string', // 可选：精确到小时
  endTime: 'string', // 可选：精确到小时
  txnType: 'All', // 可选： 默认All  All | Outgoing | Incoming
  pageNum: 1 // num | 页码
  pageSize: 10 // num | 每页展示数
}
result: {
  code: // 0 | 1
  msg:  //
  result: {
    total: num, // 总数
    data: [{
      blockHash: 'hash',
      // isPivot: bool,
      from: 'hash',
      isIn: bool,
      to: 'hash',
      isOut: bool,
      value: '',
      gas: num,
      gasPrice: 'num',
      timestamp: num, // 10bit
      contractCreated: ,
      data: '',
      epochNumber: num,
      hash: 'hash',
      nonce: num,
      r: 'hash',
      s: 'hash',
      transactionIndex: num,
      v: num,
    }, ...]
  }
}
```

#### Account Block List

```js
path: /account/:address/minedBlockList
method: 'get'
params: {
  pageNum: 1 // num | 页码
  pageSize: 10 // num | 每页展示数
}
result: {
  code: // 0 | 1
  msg:  //
  result: {
    total: num, // 总数
    data: [{
      epochNumber: num,
      position: num,
      hash: 'hash',
      difficulty: 'num',
      miner: 'hash',
      gasLimit: num,
      timestamp: num, // 10bit
      transactionSize: num, // Tx count
      //
      deferredReceiptsRoot: 'hash',
      deferredStateRoot: 'hash',
      height: num,
      isPivot: bool,
      nonce: 'hash',
      parentHash: 'hash',
      refereeHashes: [],
      size: num,
      transactionsRoot: 'hash'
    }, ...]
  }
}
```

#### Account Referee Block List

```js
path: /account/:address/refereeBlockList
method: 'get'
params: {
  pageNum: 1 // num | 页码
  pageSize: 10 // num | 每页展示数
}
result: {
  code: // 0 | 1
  msg:  // 
  result: {
    total: num, // 总数
    data: [{ 
      epochNumber: num,
      position: num,
      hash: 'hash',
      difficulty: 'num',
      miner: 'hash',
      gasLimit: num,
      timestamp: num, // 10bit
      transactionSize: num, // Tx count
      deferredReceiptsRoot: 'hash',
      deferredStateRoot: 'hash',
      height: num,
      isPivot: bool,
      nonce: 'hash',
      parentHash: 'hash',
      refereeHashes: [],
      size: num,
      transactionsRoot: 'hash'
    }, ...]
  }
}
```

#### Get type of given hash

```js
path: /util/type/:hash
method: 'get'
params: {
}
result: {
  code: 
  msg:  
  result: {
    data: 0/1/2, // 0 for block, 1 for transaction, 2 for account
  }
}
```
