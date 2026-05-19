# React Fiber 原理

这篇文章不追源码细节，只回答五个问题：

1. 为什么需要 Fiber
2. Fiber 是什么
3. React 怎么调度任务
4. React 怎么渲染页面
5. React 怎么把多个更新批量处理

如果你不是 React 开发，也可以把它理解成一套“把大任务拆成小任务，并且按优先级排队执行”的系统。

---

## 1. 为什么需要 Fiber

先看一个最朴素的问题：浏览器为什么会卡？

因为浏览器主线程既要干 JavaScript，又要做样式计算、布局、绘制，还要响应点击、输入、滚动。如果某段 JavaScript 一口气跑很久，主线程就会一直被占着，页面就像被堵在一条车道上的车流，后面的事情只能排队等着。

### 1.1 React 15 的问题

React 15 以前，组件树更新主要靠递归。

你可以把它想成下面这棵树：

```text
A
├─ B
│  ├─ D
│  └─ E
└─ C
```

递归遍历的方式大概是：

```text
A -> B -> D -> E -> C
```

这个过程有两个问题：

1. 一旦开始，就很难中途停下来
2. 树越大，递归调用栈越深，占用主线程越久

这意味着什么？

- 如果列表很长，更新可能会卡顿
- 如果用户在更新过程中点击按钮，点击事件可能要等很久才被处理
- 如果页面里还有动画，就更容易掉帧

### 1.2 React 想解决的不是“更快”，而是“更会让路”

Fiber 不是单纯为了让 React “算得更快”。

更准确地说，它想解决的是：

- 把一次大更新拆成很多小块
- 每做完一小块，就看看有没有更紧急的事
- 如果有更高优先级的任务，先让路
- 让用户感觉页面一直“活着”

所以 Fiber 的目标不是“缩短总工作量”，而是“让主线程不要被长期霸占”。

这就是 Fiber 存在的根本原因。

---

## 2. Fiber 是什么

Fiber 这个词有两层意思：

1. 一种数据结构
2. 一种更新策略

很多人只听到“Fiber 架构”，会误以为它是某个很玄的黑科技。其实它最核心的变化很朴素：

- 以前 React 更像“递归式地处理树”
- 现在 React 更像“把树变成可以逐个处理的工作单元”

### 2.1 Fiber 节点长什么样

每个 Fiber 节点都可以理解成“组件的工作记录”。

它大致会保存这些东西：

| 字段 | 作用 |
| --- | --- |
| `type` | 这是哪个组件，或者哪个 DOM 标签 |
| `key` | 用来标识同一层里的不同节点 |
| `stateNode` | 真实 DOM，或者组件实例 |
| `return` | 指向父节点 |
| `child` | 指向第一个子节点 |
| `sibling` | 指向下一个兄弟节点 |
| `alternate` | 指向另一棵树里对应的 Fiber 节点 |
| `pendingProps` | 下一次要用的 props |
| `memoizedProps` | 上一次已经算过的 props |
| `memoizedState` | 上一次已经算过的 state |
| `updateQueue` | 更新队列 |
| `flags` | 这次更新要做什么，比如插入、删除、修改 |
| `lanes` | 当前任务的优先级 |

如果你不熟 React，只需要先记住三个最重要的指针：

```text
return  -> 父节点
child   -> 第一个子节点
sibling -> 下一个兄弟节点
```

### 2.2 为什么它适合“可中断”

递归的特点是“调用栈越走越深”，一旦开始就不容易停。

Fiber 改成了“用节点之间的指针自己走树”，这样就不必依赖深递归调用栈了。  
它可以在当前节点做完后，主动把控制权交还给浏览器，等有空了再继续。

这就像：

- 递归：一个人抱着一大摞文件一路跑到底，不能停
- Fiber：把文件拆成一页一页，处理完一页就抬头看看下一件事

### 2.3 current 树和 workInProgress 树

React 同时维护两棵树：

1. `current` 树：屏幕上正在显示的那棵树
2. `workInProgress` 树：正在计算中的新树

它们通过 `alternate` 互相指向。

这叫“双缓冲”。

你可以把它理解成：

- `current` = 现成的成品
- `workInProgress` = 正在写的草稿

React 先把草稿写好，再一次性切换到成品。  
这样用户不会看到“写到一半的半成品页面”。

---

## 3. React 怎么调度任务

“调度”不是“立刻开始渲染”，而是四件事：

1. 哪个更新先做
2. 这次先做多少
3. 什么时候让出主线程
4. 下一次从哪里接着做

### 3.1 一次更新到底怎么进入调度器

还是看最常见的按钮点击：

```jsx
function App() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

点击后，React 不会马上把 DOM 改掉。它做的是：

1. 把这次更新包装成一个 `update`
2. 把 `update` 塞进对应 Fiber 的更新队列
3. 把这次更新对应的优先级记到 root 上
4. 让调度器决定“现在做，还是等一会儿做”

这一步的关键不是“更新本身”，而是“给更新贴标签”。

### 3.2 `lane` 到底是在干什么

React 18 里，优先级不再只是一个简单的高、中、低，而是用 `lane` 表示。

你可以把 `lane` 理解成一排车道：

- 输入框打字，走更快的车道
- 普通状态更新，走普通车道
- 可以慢一点的更新，走低优先级车道

这样做的好处是：

- 多个更新可以同时存在
- React 只要看哪些车道更紧急，就知道先处理谁
- 高优先级来了，不需要等低优先级慢慢跑完

### 3.3 真正“安排工作”的地方

React 内部会做一件很像排班的事：

```js
function ensureRootIsScheduled(root) {
  const nextLanes = getNextLanes(root)
  const nextPriority = lanesToSchedulerPriority(nextLanes)

  // 如果当前已经有同等级的任务，就不用重新排
  if (root.callbackPriority === nextPriority) {
    return
  }

  // 如果原来有旧任务，先取消
  if (root.callbackNode !== null) {
    cancelCallback(root.callbackNode)
  }

  // 再按新的优先级重新挂一个回调
  root.callbackNode = scheduleCallback(nextPriority, () => {
    return performConcurrentWorkOnRoot(root)
  })

  root.callbackPriority = nextPriority
}
```

这段伪代码的意思是：

- `root` 上保存着“还有哪些更新没处理”
- `ensureRootIsScheduled` 会选出当前最紧急的那批任务
- 如果出现更高优先级的任务，旧任务会被替换掉

注意，这里说的“取消”不是把正在执行的 JavaScript 强行打断。  
JavaScript 是单线程的，React 没办法把一个已经跑起来的函数瞬间掐掉。

React 能做的是：

- 在合适的检查点主动停下来
- 把控制权还给浏览器
- 下次再从保存好的状态继续

这才是 Fiber 真正的“可中断”。

### 3.4 调度器怎么让出主线程

调度器真正干活时，会一边处理 Fiber，一边不停问自己：

> 现在还要不要继续做下去？

大致逻辑像这样：

```js
function performConcurrentWorkOnRoot(root) {
  // 先选出这次要处理的 lanes
  const lanes = getNextLanes(root)

  // 如果没有正在进行的工作，或者当前工作已经过期/被更高优先级顶掉，
  // 就重新准备一个 workInProgress 树
  if (shouldRestartFromRoot(root, lanes)) {
    prepareFreshStack(root, lanes)
  }

  // 开始执行本轮工作
  workLoopConcurrent()

  // 如果还没做完，就把剩余工作留给下一次回调
  if (workInProgress !== null) {
    return performConcurrentWorkOnRoot.bind(null, root)
  }

  // 做完了，进入 commit
  commitRoot(root)
}
```

真正决定“要不要先停”的，是 `workLoopConcurrent` 里面的检查：

```js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

这里最重要的是 `shouldYield()`。

它的意思不是“任务没了”，而是：

> 当前这段时间片快用完了，先把主线程还给浏览器。

所以 React 的“交出去”并不是把一个任务扔掉，而是：

- 做到一个边界
- 立刻返回
- 让浏览器先处理输入、绘制、动画

### 3.5 更高级任务来了，怎么插队

这是你最关心的部分。

假设页面正在渲染一个很大的列表：

```jsx
function BigList({ items }) {
  return items.map(item => <Row key={item.id} item={item} />)
}
```

React 正在处理第 1 000 个节点的时候，用户突然点了一个输入框。

这时会发生什么？

1. 输入事件触发一个新的 `setState`
2. 这个 `setState` 被赋予更高的 `lane`
3. root 上的 `pendingLanes` 发生变化
4. `ensureRootIsScheduled` 看到有更高优先级任务，重新安排回调
5. 当前这轮 render 到下一个 `shouldYield()` 时停下
6. 浏览器先去处理输入和绘制
7. 之后 React 用新的优先级继续工作

这里有两种情况：

- 如果新的高优先级更新和当前工作可以复用，React 会接着做
- 如果新的更新让旧的 workInProgress 失效，React 会从 root 重新开始算

这就是为什么 Fiber 不是“简单暂停一下再继续跑”。
它有时会继续，有时会重算，取决于新来的任务是否改变了当前计算结果。

### 3.6 它到底是怎么“回来”的

React 能回来，不是因为 JS 调用栈还在，而是因为这些状态都保存在内存里：

- `workInProgressRoot`
- `workInProgress`
- `workInProgressRootRenderLanes`
- 各个 Fiber 节点上的 `child / sibling / return`

也就是说，React 不靠“栈记忆”，而靠“对象记忆”。

当下一次调度回调再次执行时，React 会检查：

1. 这棵树是否还在渲染中
2. 是否有更高优先级的 lane
3. 当前 `workInProgress` 是否还能继续用

如果能用，就从上一次停下的 Fiber 节点继续往下走。  
如果不能用，就丢掉旧的中间结果，重新从 root 计算。

这就是“回来接着渲染”的真实含义。

### 3.7 一段更贴近真实的伪代码

```js
function scheduleUpdateOnFiber(fiber, lane) {
  const root = markUpdateLaneFromFiberToRoot(fiber, lane)
  ensureRootIsScheduled(root)
}

function ensureRootIsScheduled(root) {
  const nextLanes = getNextLanes(root)
  const schedulerPriority = lanesToSchedulerPriority(nextLanes)

  if (root.callbackNode !== null) {
    cancelCallback(root.callbackNode)
  }

  root.callbackNode = scheduleCallback(schedulerPriority, () => {
    return performConcurrentWorkOnRoot(root)
  })
}

function performConcurrentWorkOnRoot(root) {
  const lanes = getNextLanes(root)
  prepareOrReuseWorkInProgress(root, lanes)

  while (workInProgress !== null) {
    if (shouldYield()) {
      // 让出主线程，等下一次调度再回来
      return performConcurrentWorkOnRoot.bind(null, root)
    }

    workInProgress = performUnitOfWork(workInProgress)
  }

  commitRoot(root)
}
```

这段伪代码想表达的重点只有一个：

- 调度器负责“什么时候再来”
- workInProgress 负责“回来时从哪接着做”
- lanes 负责“现在谁更重要”

---

## 4. React 怎么渲染页面

React 的渲染可以分成两个大阶段：

1. `render` 阶段
2. `commit` 阶段

很多人第一次听这两个词会混淆。  
其实它们的职责完全不同。

### 4.1 render 阶段：计算阶段

render 阶段的任务是：

- 读旧数据
- 算新数据
- 找出差异
- 构建新的 workInProgress 树

这个阶段有一个很重要的特点：

> 不改真实 DOM。

因为它只是“算”，不是“改”。

所以 render 阶段可以被打断，可以暂停，可以重来。

### 4.2 commit 阶段：提交阶段

commit 阶段的任务是：

- 真正修改 DOM
- 执行生命周期
- 处理 ref
- 执行副作用

这个阶段不能随便打断。  
因为它做的是“落地动作”，必须保持一致性。

如果你把 render 阶段比作“写草稿”，那 commit 阶段就是“把草稿交卷”。

### 4.3 Fiber 的渲染顺序

一个典型的 Fiber 渲染流程大概是：

```text
开始更新
  -> 找到根节点
  -> 进入 render 阶段
  -> 一次处理一个 Fiber 节点
  -> 途中如果时间不够就暂停
  -> 继续恢复
  -> 所有节点处理完后进入 commit 阶段
  -> 一次性提交 DOM 变化
```

### 4.4 处理一个 Fiber 节点时会发生什么

React 会把每个节点的工作拆成两步：

1. `beginWork`
2. `completeWork`

#### beginWork 做什么

它负责：

- 看这个节点有没有更新
- 要不要继续往下找子节点
- 生成子 Fiber

#### completeWork 做什么

它负责：

- 收集副作用
- 准备要提交的变更

### 4.5 render 阶段的伪代码

```js
function workLoopConcurrent() {
  while (nextUnitOfWork !== null && !shouldYield()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  if (nextUnitOfWork) {
    // 这次没做完，留到下一次调度
    return workLoopConcurrent
  } else {
    // render 阶段结束，进入 commit
    commitRoot()
  }
}

function performUnitOfWork(fiber) {
  // 1. 计算当前节点
  const next = beginWork(fiber)

  // 2. 如果没有子节点，就向上回退，补全兄弟节点
  if (!next) {
    completeUnitOfWork(fiber)
  }

  return next
}
```

这段伪代码比 `requestIdleCallback` 更接近真实实现。  
重点不是“浏览器告诉 React 还剩多少毫秒”，而是“React 在每个工作单元之间主动检查是否该让路”。

### 4.6 一个更直观的例子

假设页面里有一个很大的商品列表：

```jsx
function ProductList({ list }) {
  return (
    <ul>
      {list.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

如果 `list` 很长，旧的同步递归方式可能会一口气把所有节点算完。  
Fiber 方式则更像：

1. 先算前 20 个节点
2. 看看浏览器有没有更紧急的事
3. 如果有，先停
4. 没有，再继续算后面的节点

最后 commit 阶段再统一更新 DOM。

---

## 5. React 怎么批量更新

“批量更新”就是：

> 多个状态更新，不要每次都单独触发一次完整渲染，而是先收集起来，最后一起处理。

### 5.1 为什么要批量

如果你一口气执行很多次更新，比如：

```js
setCount(c => c + 1)
setCount(c => c + 1)
setCount(c => c + 1)
```

最笨的做法是：

- 更新一次，渲染一次
- 再更新一次，再渲染一次
- 再更新一次，再渲染一次

这样很浪费。

正确做法是：

- 先把这 3 次更新放进队列
- 等这一轮处理完，再统一算最终结果
- 最后只提交一次 DOM

### 5.2 批量更新的核心

批量更新不是把状态“抹平”，而是把“更新动作”先缓存起来。

React 内部更像是在做这件事：

```text
当前状态 = 0
更新队列 = [c => c + 1, c => c + 1, c => c + 1]
最终结果 = 3
```

它不是直接把状态改三次，而是把三次更新按顺序执行，算出最后的值。  
如果你写的是 `setCount(count + 1)` 三次，那么因为这三次都拿到的是同一个旧值，最后结果通常只会变成 `1`，这就是很多人常见的“闭包看起来没生效”的原因。

### 5.3 事件结束后统一刷新的思路

你可以把一次事件处理过程想成这样：

```text
点击按钮
  -> 执行事件处理函数
  -> 收集多个 setState
  -> 事件结束
  -> React 统一刷新
```

这样做的好处是：

- 减少重复计算
- 减少重复提交 DOM
- 降低卡顿

### 5.4 批量更新的伪代码

```js
let isBatching = false
const updateQueue = []

function batchedUpdates(fn) {
  isBatching = true
  fn()
  isBatching = false
  flushUpdates()
}

function setState(update) {
  updateQueue.push(update)

  if (!isBatching) {
    flushUpdates()
  }
}

function flushUpdates() {
  const updates = updateQueue.splice(0)
  let nextState = currentState

  for (const update of updates) {
    nextState = applyUpdate(nextState, update)
  }

  render(nextState)
  commit()
}
```

### 5.5 批量更新和“可中断渲染”不是一回事

这两个概念经常被混在一起，但它们不一样：

1. 批量更新：把多个更新合并成一次计算和提交
2. 可中断渲染：计算过程中可以暂停，稍后继续

它们的关系是：

- 批量更新解决“别重复干活”
- Fiber 调度解决“干活别一直占着主线程”

这两者配合起来，React 才能既省事，又不容易卡。

### 5.6 一个简单的批量更新例子

```jsx
function Demo() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(c => c + 1)
    setCount(c => c + 1)
    setCount(c => c + 1)
  }

  return <button onClick={handleClick}>{count}</button>
}
```

从“写代码的人”的角度看，你点一次按钮触发了 3 次更新。  
从 React 的角度看，它会把这些更新放进同一个更新队列里，最后按规则算出最终状态，而不是每次都重新走一遍完整渲染流程。

如果这些更新来自同一次用户事件，React 通常会一起处理。  
如果某个更新优先级更高，它甚至可以插队，先处理更紧急的任务。

> 注：从 React 18 开始，更多异步场景也会自动批处理，比如 Promise、setTimeout、原生事件中的更新。底层思路没变，还是“先收集 update，再统一 render / commit”。

---

## 6. 一次完整更新到底发生了什么

把前面的内容连起来，就是这个顺序：

```text
1. 用户触发更新
2. React 把更新放进队列
3. React 给更新打上优先级标签
4. 调度器安排工作
5. render 阶段开始，构建 workInProgress 树
6. 过程中如果时间不够，可以暂停
7. 所有计算完成后进入 commit
8. 一次性把结果提交到 DOM
9. 触发副作用、生命周期、ref 等
```

你可以把它理解成一个“先算后交”的流程：

- 先算差异
- 再统一落地
- 中间允许插队

---

## 7. 用一个生活例子理解

假设你在奶茶店点单。

### 7.1 旧的同步方式

你点了 20 杯，店员一杯做完立刻送出去，再做下一杯。

这会发生什么？

- 过程很碎
- 店员忙不过来
- 后面排队的人一直等

### 7.2 Fiber 的方式

店员会这样做：

1. 先记下所有订单
2. 先做一部分
3. 如果有加急单，先做加急单
4. 最后统一出餐

这就像 Fiber：

- 订单记录 = update queue
- 加急单 = 高优先级任务
- 分批制作 = 可中断渲染
- 统一出餐 = commit 阶段

---

## 8. 你可以记住的最简版流程

如果你只想记一个简化公式，那就是：

```text
setState
  -> enqueue update
  -> schedule
  -> render
  -> commit
```

再翻译成人话：

1. 先记账
2. 再排队
3. 再计算
4. 最后统一提交

---

## 9. 一段更完整的伪代码

下面这段伪代码把“调度 + 渲染 + 提交 + 批量更新”串在一起：

```js
function dispatchSetState(fiber, action) {
  const update = {
    action,
    next: null,
  }

  enqueueUpdate(fiber.updateQueue, update)
  markRootUpdated(fiber.root)
  scheduleUpdateOnRoot(fiber.root)
}

function scheduleUpdateOnRoot(root) {
  const lane = getHighestPriorityLane(root.pendingLanes)
  const task = () => performConcurrentWorkOnRoot(root, lane)
  scheduler.postTask(task)
}

function performConcurrentWorkOnRoot(root, lane) {
  prepareFreshStack(root)

  while (nextUnitOfWork && shouldYield()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  if (nextUnitOfWork) {
    // 这次没做完，下一轮继续
    return performConcurrentWorkOnRoot(root, lane)
  }

  commitRoot(root)
}

function performUnitOfWork(fiber) {
  const next = beginWork(fiber)

  if (next === null) {
    completeUnitOfWork(fiber)
  }

  return next
}

function commitRoot(root) {
  commitBeforeMutationEffects(root)
  commitMutationEffects(root)
  commitLayoutEffects(root)
  flushPassiveEffects(root)
}
```

你不需要把这些函数名背下来。  
你只要理解它们分别代表什么：

- `enqueueUpdate`：把更新放入队列
- `scheduleUpdateOnRoot`：安排什么时候开始做
- `performUnitOfWork`：一次处理一个工作单元
- `commitRoot`：把结果真正写到页面上

---

## 10. 最后总结

React Fiber 的本质，不是把 React 变成了“神奇的更快引擎”，而是把更新过程改造成了：

- 可拆分
- 可暂停
- 可恢复
- 可排序
- 可批量

所以你可以把它记成一句话：

> Fiber 不是为了少做事，而是为了把事分开做、按优先级做、在合适的时候做。

如果再压缩成一行：

```text
React Fiber = 任务拆分 + 优先级调度 + 可中断渲染 + 统一提交
```

这就是它解决卡顿、支持批量更新、提升交互体验的核心原因。
