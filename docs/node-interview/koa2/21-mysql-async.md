---
title: # async/await封装使用mysql
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-8.2 async await封装使用mysql.html
crawled: 2026-04-09
---

# # async/await封装使用mysql

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-8.2 async await封装使用mysql.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-8.2 async await封装使用mysql.html)

---

# [#](#async-await封装使用mysql) async/await封装使用mysql

## [#](#前言) 前言

由于mysql模块的操作都是异步操作，每次操作的结果都是在回调函数中执行，现在有了async/await，就可以用同步的写法去操作数据库

### [#](#promise封装mysql模块) Promise封装mysql模块

#### [#](#promise封装-async-db) Promise封装 ./async-db

```
const mysql = require('mysql')
const pool = mysql.createPool({
  host     :  '127.0.0.1',
  user     :  'root',
  password :  '123456',
  database :  'my_database'
})

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }
```

#### [#](#async-await使用) async/await使用

```
const { query } = require('./async-db')
async function selectAllData( ) {
  let sql = 'SELECT * FROM my_table'
  let dataList = await query( sql )
  return dataList
}

async function getData() {
  let dataList = await selectAllData()
  console.log( dataList )
}

getData()
```

阅读全文