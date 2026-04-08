# 事件循环

JavaScript 是单线程语言，事件循环（Event Loop）是其处理异步操作的机制。

## 执行模型

```
┌──────────────────────────┐
│          调用栈            │
│    (Call Stack)           │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐     ┌──────────────────┐
│        Web APIs          │◄────│   异步操作        │
│  (setTimeout/DOM/AJAX)   │     │   (定时器/网络)   │
└────────────┬─────────────┘     └──────────────────┘
             │
             ▼
┌──────────────────────────┐
│       回调队列             │
│   (Callback Queue)        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│        事件循环            │
│    (Event Loop)           │
└──────────────────────────┘
```

## 调用栈示例

```javascript
function a() {
  console.log('a');
  b();
}

function b() {
  console.log('b');
  c();
}

function c() {
  console.log('c');
}

a();
// 输出: a → b → c
```

调用栈变化：

```
 push a()    push b()    push c()    pop c()     pop b()     pop a()
    │           │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼           ▼
┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
│  a   │    │  a   │    │  a   │    │  a   │    │  a   │    │      │
│      │    │  b   │    │  b   │    │  b   │    │      │    │      │
│      │    │      │    │  c   │    │      │    │      │    │      │
└──────┘    └──────┘    └──────┘    └──────┘    └──────┘    └──────┘
```

## 宏任务与微任务

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');  // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log('3');  // 微任务
});

console.log('4');

// 输出: 1 → 4 → 3 → 2
```

### 任务优先级

```
调用栈清空后：
  1. 执行所有微任务（Promise/process.nextTick）
  2. 渲染（如果需要）
  3. 取出一个宏任务执行（setTimeout/setInterval）
  4. 重复步骤 1
```

## 复杂示例

```javascript
console.log('script start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => {
    console.log('promise in timeout');
  });
}, 0);

setTimeout(() => {
  console.log('timeout 2');
}, 0);

Promise.resolve().then(() => {
  console.log('promise 1');
}).then(() => {
  console.log('promise 2');
});

console.log('script end');

// 输出：
// script start
// script end
// promise 1
// promise 2
// timeout 1
// promise in timeout
// timeout 2
```

::: tip 注意
微任务会在每个宏任务之间清空，所以 `promise in timeout` 会在 `timeout 2` 之前执行。
:::
