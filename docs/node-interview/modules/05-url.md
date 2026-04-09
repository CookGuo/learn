---
title: 网络地址解析 url|Nodejs专题系列 | Node学习指南
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/modules/-5.0 网络地址解析 url.html
crawled: 2026-04-09
---

# 网络地址解析 url|Nodejs专题系列 | Node学习指南

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/modules/-5.0 网络地址解析 url.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/modules/-5.0 网络地址解析 url.html)

---

## [#](#模块概述) 模块概述

nodejs中，提供了**url**这个非常实用的模块，用来做URL的解析。在做node服务端的开发时会经常用到。使用很简单，总共只有3个方法。

## [#](#模块方法概述) 模块方法概述

url模块三个方法分别是：

*   **.parse(urlString)**：将url字符串，解析成object，便于开发者进行操作。
*   **.format(urlObj)**：.parse() 方法的反向操作。
*   **.resove(from, to)**：以from作为起始地址，解析出完整的目标地址（还是看直接看例子好些）

## [#](#url解析-url-parse) url解析：url.parse()

> 完整语法：url.parse(urlString\[, parseQueryString\[, slashesDenoteHost\]\])

使用比较简单，几个要点备忘如下。

1.  **parseQueryString**：（默认为false）如为false，则`urlObject.query`为未解析的字符串，比如`nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1`，且对应的值不会decode；如果`parseQueryString`为true，则`urlObject.query`为object，比如`{ nick: '程序员poetry' }`，且值会被decode；
2.  **slashesDenoteHos**：（默认为false）如果为true，那么类似`//foo/bar`里的`foo`就会被认为是`hostname`；如果为false，则`foo`被认为是pathname的一部分。
3.  关于解析得到的 urlObject ，会在下一小节进行详细介绍。

### [#](#例子1-参数值不进行解析) 例子1：参数值不进行解析

代码如下：

```
var url = require('url');
var str = 'http://Chyingp:HelloWorld@ke.qq.com:8080/index.html?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1#part=1';

var obj = url.parse(str);
console.log(obj);
```

输出如下：

```
Url {
  protocol: 'http:',
  slashes: true,
  auth: 'Chyingp:HelloWorld',
  host: 'ke.qq.com:8080',
  port: '8080',
  hostname: 'ke.qq.com',
  hash: '#part=1',
  search: '?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1',
  query: 'nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1',
  pathname: '/index.html',
  path: '/index.html?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1',
  href: 'http://Chyingp:HelloWorld@ke.qq.com:8080/index.html?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1#part=1' }
```

### [#](#例子2-对参数值进行decode) 例子2：对参数值进行decode

代码如下：

```
var url = require('url');
var str = 'http://Chyingp:HelloWorld@ke.qq.com:8080/index.html?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1#part=1';

var obj = url.parse(str, true);
console.log(obj);
```

输出如下，对比上面的例子会发现，**query** 字段被解析成了object，并且decode过。

```
Url {
  protocol: 'http:',
  slashes: true,
  auth: 'Chyingp:HelloWorld',
  host: 'ke.qq.com:8080',
  port: '8080',
  hostname: 'ke.qq.com',
  hash: '#part=1',
  search: '?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1',
  query: { nick: '程序员poetry' },
  pathname: '/index.html',
  path: '/index.html?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1',
  href: 'http://Chyingp:HelloWorld@ke.qq.com:8080/index.html?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1#part=1' }
```

### [#](#例子3-针对路径-foo-bar-的处理) 例子3：针对路径 //foo/bar 的处理

代码如下：

```
var url = require('url');
var str = '//foo/bar';

var obj = url.parse(str, true, false);
console.log(obj);

obj = url.parse(str, true, true);
console.log(obj);
```

输出如下，自行对比两者之间的差异：

```
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '',
  query: {},
  pathname: '//foo/bar',
  path: '//foo/bar',
  href: '//foo/bar' }
Url {
  protocol: null,
  slashes: true,
  auth: null,
  host: 'foo',
  port: null,
  hostname: 'foo',
  hash: null,
  search: '',
  query: {},
  pathname: '/bar',
  path: '/bar',
  href: '//foo/bar' }
```

## [#](#关于urlobject) 关于urlObject

以上面的作为例子，粗略讲解下`urlObject`。更多细节可参考[官方文档 (opens new window)](https://nodejs.org/api/url.html#url_url_strings_and_url_objects)。

*   protocol：协议，需要注意的是包含了`:`，并且是小写的。
*   slashes：如果`:`后面跟了两个`//`，那么为true。
*   auth：认证信息，如果有密码，为`usrname:passwd`，如果没有，则为`usrname`。注意，这里区分大小写。
*   host：主机名。注意包含了端口，比如`ke.qq.com:8080`，并且是小写的。
*   hostname：主机名，不包含端口，并且是小写的。
*   hash：哈希部分，注意包含了`#`。
*   search：查询字符串，注意，包含了`?`，此外，值是没有经过decode的。
*   query：字符串 或者 对象。如果是字符串，则是`search`去掉`?`，其余一样；如果是对象，那么是decode过的。
*   path：路径部分，包含search部分。
*   pathname：路径部分，不包含search部分。
*   href：原始的地址。不过需要注意的是，`protocol`、`host`会被转成小写字母。

```
{
  protocol: 'http:',
  slashes: true,
  auth: 'Chyingp:HelloWorld',
  host: 'ke.qq.com:8080',
  port: '8080',
  hostname: 'ke.qq.com',
  hash: '#part=1',
  search: '?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1',
  query: { nick: '程序员poetry' },
  pathname: '/index.html',
  path: '/index.html?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1',
  href: 'http://Chyingp:HelloWorld@ke.qq.com:8080/index.html?nick=%E7%A8%8B%E5%BA%8F%E7%8C%BF%E5%B0%8F%E5%8D%A1#part=1' }
```

## [#](#url拼接-url-format-urlobject) url拼接：url.format(urlObject)

> 完整语法：url.format(urlObject)

`url.parse(str)`的反向操作，没什么好说的。`urlObject`包含了很多字段，比如`protocol`、`slashes`、`protocol`等，且不一定需要全部传，所以有一套解析逻辑。

过程比较冗长，大部分时候不需要用到，直接贴[官方文档 (opens new window)](https://nodejs.org/api/url.html#url_url_format_urlobject)的链接，有需要再看。

## [#](#url-resolve-from-to) url.resolve(from, to)

用法比较简单，直接贴官方文档的例子

```
url.resolve('/one/two/three', 'four')         // '/one/two/four'
url.resolve('http://example.com/', '/one')    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two') // 'http://example.com/two'
```

## [#](#非法字符转义) 非法字符转义

url字符如果有下面的字符会被转义（非法字符）

> < > " \` \\r \\n \\t { } | \\ ^ '

## [#](#相关链接) 相关链接

官方文档：[https://nodejs.org/api/url.html#url\_url (opens new window)](https://nodejs.org/api/url.html#url_url)

阅读全文