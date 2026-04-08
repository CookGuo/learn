# Promise 与异步

JavaScript 是单线程语言，异步编程是处理非阻塞操作的关键。

## 回调函数

```javascript
// 传统回调方式
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: 'John' };
    callback(null, data);
  }, 1000);
}

fetchData((err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});
```

## Promise

```javascript
// Promise 封装异步操作
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { id: 1, name: 'John' };
      resolve(data);
      // 或 reject(new Error('Failed'));
    }, 1000);
  });
}

// 使用 Promise
fetchData()
  .then(data => {
    console.log(data);
    return processData(data);
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log('Done');
  });
```

### Promise 静态方法

```javascript
// Promise.all - 所有成功才成功
Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
]).then(([user, posts, comments]) => {
  console.log('All loaded');
});

// Promise.race - 返回最快完成的
Promise.race([
  fetchFromAPI1(),
  fetchFromAPI2()
]).then(result => {
  console.log('Fastest result');
});

// Promise.allSettled - 等待所有完成
Promise.allSettled([
  promise1,
  promise2
]).then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log('Success:', result.value);
    } else {
      console.log('Error:', result.reason);
    }
  });
});

// Promise.any - 返回首个成功的
Promise.any([
  fetchFromAPI1(),
  fetchFromAPI2()
]).then(result => {
  console.log('First success');
}).catch(error => {
  console.log('All failed');
});
```

## async/await

```javascript
// async 函数返回 Promise
async function getUserData() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// 并行执行
async function getAllData() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  return { user, posts, comments };
}

// 循环中的异步
async function processItems(items) {
  // 串行执行
  for (const item of items) {
    await processItem(item);
  }
  
  // 并行执行
  await Promise.all(items.map(item => processItem(item)));
}
```

## 异步迭代器

```javascript
// 异步生成器
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const data = await fetch(`${url}?page=${page}`);
    if (data.length === 0) break;
    yield data;
    page++;
  }
}

// 使用 for await...of
for await (const page of fetchPages('/api/items')) {
  console.log(page);
}
```

## 错误处理最佳实践

```javascript
// 顶层错误处理
async function main() {
  try {
    await doSomething();
  } catch (error) {
    if (error instanceof NetworkError) {
      showNetworkError();
    } else if (error instanceof ValidationError) {
      showValidationError(error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// 超时封装
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
  return Promise.race([promise, timeout]);
}

await withTimeout(fetchData(), 5000);
```

::: tip 现代异步编程建议
- 优先使用 async/await，代码更易读
- 始终处理错误，使用 try/catch
- 并行操作时合理使用 Promise.all
- 注意在循环中正确使用 await
:::
