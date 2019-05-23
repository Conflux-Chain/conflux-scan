# Conflux Scan V2.0 API

- [Global Contract](#global-contract)
- [API Reference](#api-reference)
  - [Block list](#block-list)
  - [Txc List](#txc-list)
  
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

#### Block List

```js
path: /block/list
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
      deferredReceiptsRoot: 'hash',
      deferredStateRoot: 'hash',
      difficulty: 'num',
      epochNumber: num,
      gasLimit: num,
      hash: 'hash',
      height: num,
      isPivot: bool,
      miner: 'hash',
      nonce: 'hash',
      parentHash: 'hash',
      refereeHashes: [],
      size: num,
      timestamp: num, // 10bit
      transactionSize: num,
      transactionsRoot: 'hash'
    }, ...]
  }
}
```

#### Txc List


```js
path: /block/list
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
      deferredReceiptsRoot: 'hash',
      deferredStateRoot: 'hash',
      difficulty: 'num',
      epochNumber: num,
      gasLimit: num,
      hash: 'hash',
      height: num,
      isPivot: bool,
      miner: 'hash',
      nonce: 'hash',
      parentHash: 'hash',
      refereeHashes: [],
      size: num,
      timestamp: num, // 10bit
      transactionSize: num,
      transactionsRoot: 'hash'
    }, ...]
  }
}
```