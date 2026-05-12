---
title: Vue3 响应式原理详解
---

# Vue3 响应式原理详解

Vue3 响应式系统的核心目标是：当数据被读取时，记录谁依赖了它；当数据被修改时，精准通知这些依赖重新执行。组件渲染、`computed`、`watch`、`watchEffect` 都建立在这套机制之上。

一句话概括执行链路：

```text
reactive/ref 创建响应式数据
effect 执行副作用函数
读取数据时 track 收集依赖
修改数据时 trigger 触发依赖
依赖重新执行，视图或派生状态更新
```

## 一、为什么 Vue3 改用 Proxy

Vue2 使用 `Object.defineProperty` 劫持对象属性，需要初始化时递归遍历每个 key，并且对新增属性、删除属性、数组索引、数组长度变化处理不自然。

Vue3 使用 `Proxy` 代理整个对象，可以拦截更多操作：

```ts
get(target, key, receiver)       // 读取属性
set(target, key, value, receiver) // 设置属性
has(target, key)                 // in 操作
ownKeys(target)                  // Object.keys、for...in
deleteProperty(target, key)      // delete
```

这让 Vue3 不只可以追踪 `state.name`，也可以追踪属性是否存在、对象迭代、数组长度、`Map` 和 `Set` 的变化。

## 二、核心数据结构

Vue3 用一个全局依赖表保存响应式对象、属性和副作用函数之间的关系。

```ts
WeakMap<object, Map<key, Set<ReactiveEffect>>>
```

可以理解为：

```text
targetMap
└── 原始对象 target
    ├── name -> Set(effect1, effect2)
    └── age  -> Set(effect1)
```

三层结构分别解决三个问题：

- `WeakMap`：以原始对象为 key。对象不再使用后，依赖关系可以被垃圾回收。
- `Map`：以属性名为 key。不同属性拥有不同依赖集合。
- `Set`：保存依赖该属性的 effect，并天然去重。

为什么 key 必须是原始对象，而不是代理对象？因为同一个原始对象可能被多次传入 `reactive`。依赖表绑定原始对象，才能保证依赖关系稳定。

## 三、reactive：创建响应式对象

`reactive` 接收一个对象，返回它的代理对象。

```ts
const state = reactive({ name: 'jw', age: 30 })
```

真实实现会做几类保护。

### 3.1 非对象不代理

`Proxy` 只能代理对象。基本类型会直接返回。

```ts
reactive(1)      // 1
reactive('name') // 'name'
reactive(null)   // null
```

所以基本类型要用 `ref`，不能用 `reactive`。

### 3.2 避免重复代理

同一个原始对象多次调用 `reactive`，应该返回同一个 proxy。

```ts
const raw = { name: 'jw' }
const p1 = reactive(raw)
const p2 = reactive(raw)

console.log(p1 === p2) // true
```

Vue3 内部用 WeakMap 缓存：

```text
reactiveMap: raw object -> proxy
readonlyMap: raw object -> readonly proxy
```

这样可以避免重复创建代理，也能保证对象身份稳定。

### 3.3 避免代理再次被代理

如果传入的已经是 proxy，Vue3 会通过内部标记直接返回已有代理。

常见内部标记包括：

```text
__v_isReactive  是否 reactive
__v_isReadonly  是否 readonly
__v_raw         指向原始对象
__v_skip        跳过代理
```

所以：

```ts
const p1 = reactive(raw)
const p2 = reactive(p1)

console.log(p1 === p2) // true
```

### 3.4 markRaw 跳过代理

某些对象不应该被 Vue 代理，比如第三方类实例、复杂库对象、大型不可变数据。

```ts
const chart = markRaw(new Chart())
const state = reactive({ chart })
```

`markRaw` 会给对象打上跳过标记。以后 `reactive` 遇到它，会直接返回原对象。

### 3.5 shallowReactive 只代理第一层

`reactive` 是深层响应式。读取到嵌套对象时，嵌套对象也会变成响应式。

```ts
const state = reactive({ user: { name: 'jw' } })
state.user.name // user 也是响应式对象
```

`shallowReactive` 只代理第一层：

```ts
const state = shallowReactive({ user: { name: 'jw' } })
state.user.name // user 仍是普通对象
```

它适合大型对象、外部状态或只关心顶层引用变化的场景。

## 四、get：读取时收集依赖

响应式对象被读取时，会进入 `get` 拦截。

```ts
effect(() => {
  console.log(state.name)
})
```

执行过程：

```text
effect 开始执行
activeEffect 指向当前 effect
读取 state.name
get 拦截
track(target, 'name')
把 activeEffect 收集到 name 对应的 Set 中
```

核心伪代码：

```ts
function track(target, key) {
  if (!shouldTrack || activeEffect === undefined) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  trackEffects(dep)
}
```

`trackEffects` 还会做依赖去重：

```ts
function trackEffects(dep) {
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}
```

同一个 effect 中重复读取同一个属性，不会被重复收集。

```ts
effect(() => {
  state.name
  state.name
  state.name
})
```

最终 `name` 的依赖集合里仍然只有一个 effect。

## 五、set：修改时触发更新

响应式对象被修改时，会进入 `set` 拦截。

```ts
state.name = 'jiang'
```

执行过程：

```text
set 拦截
判断是新增属性还是修改属性
判断新旧值是否真的变化
trigger(target, 'name')
找到 name 对应的 effects
执行或调度这些 effects
```

核心伪代码：

```ts
function trigger(target, key, type, newValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const effects = new Set()
  addEffects(effects, depsMap.get(key))

  triggerEffects(effects)
}
```

Vue3 不会只看 key，还会区分触发类型：

```text
SET     修改已有属性
ADD     新增属性
DELETE  删除属性
CLEAR   清空集合
```

这对对象迭代、数组、`Map`、`Set` 非常重要。

### 5.1 基础例子：为什么修改数据会更新页面

先看一个最小的响应式渲染例子：

```ts
const state = reactive({ name: 'jw', age: 30 })

effect(() => {
  app.innerHTML = state.name + state.age
})

setTimeout(() => {
  state.name = 'jiang'
}, 1000)
```

第一次执行 `effect` 时，函数内部读取了 `state.name` 和 `state.age`。因此依赖表会形成两条关系：

```text
name -> 当前 effect
age  -> 当前 effect
```

1 秒后修改 `state.name`，会触发 `name` 对应的 effect 重新执行。重新执行时，`app.innerHTML` 会再次读取最新的 `state.name` 和 `state.age`，页面自然就更新了。

这个例子说明了响应式最重要的闭环：

```text
effect 执行 -> 读取数据 -> 收集依赖
数据变化 -> 找到依赖 -> effect 重新执行
```

## 六、effect：副作用函数

`effect` 是响应式系统的执行单元。组件渲染函数、`watchEffect`、`computed` 内部都可以看成特殊的 effect。

```ts
effect(() => {
  document.body.innerHTML = state.name
})
```

`effect` 的核心职责有三个：

- 执行传入的函数。
- 执行期间把自己设置为当前正在收集的 `activeEffect`。
- 记录自己被哪些依赖集合收集过，方便后续清理。

简化结构：

```ts
class ReactiveEffect {
  active = true
  deps = []
  parent = undefined

  constructor(public fn, public scheduler?) {}

  run() {
    if (!this.active) {
      return this.fn()
    }

    try {
      this.parent = activeEffect
      activeEffect = this
      cleanupEffect(this)
      return this.fn()
    } finally {
      activeEffect = this.parent
      this.parent = undefined
    }
  }
}
```

## 七、deps：effect 的反向索引

依赖表能通过对象属性找到 effect：

```text
state.name -> Set(effect)
state.age  -> Set(effect)
```

但 effect 也需要知道自己被哪些 dep 收集过：

```text
effect.deps -> [nameDep, ageDep]
```

这个反向索引用来做两件事。

第一，执行前清理旧依赖。

```ts
cleanupEffect(effect)
```

第二，停止 effect 时从所有 dep 中移除自己。

```ts
runner.effect.stop()
```

没有 `deps`，就只能遍历整个 `targetMap` 才能清理某个 effect，成本非常高。

## 八、cleanupEffect：清理过期依赖

条件分支是响应式系统必须处理的重点。

```ts
effect(() => {
  document.body.innerHTML = state.flag ? state.name : state.age
})
```

第一次执行时，如果 `flag` 是 `true`，依赖关系是：

```text
flag -> effect
name -> effect
```

当 `flag` 变成 `false` 后，effect 重新执行，本次真正用到的是：

```text
flag -> effect
age  -> effect
```

如果不清理旧依赖，`name` 仍然保存这个 effect。之后修改 `state.name`，即使页面已经不再使用它，也会触发更新。

所以每次 effect 重新执行前，要把自己从旧的 dep 中删除：

```ts
function cleanupEffect(effect) {
  const deps = effect.deps
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect)
  }
  effect.deps.length = 0
}
```

清理后再执行函数，根据本轮实际读取到的数据重新收集依赖。

真实 Vue3 为了性能，不会总是粗暴地全量清理。它会使用依赖标记位优化收集与清理，但目标仍然是删除过期依赖。

### 8.1 条件分支例子：切换后不应该再响应旧字段

```ts
const state = reactive({
  name: 'jw',
  age: 30,
  flag: true
})

effect(() => {
  console.log('runner')
  app.innerHTML = state.flag ? state.name : state.age
})

setTimeout(() => {
  state.flag = false

  setTimeout(() => {
    state.name = 'xxx'
  }, 1000)
}, 1000)
```

第一次执行时，`flag` 为 `true`，effect 读取的是 `state.flag` 和 `state.name`。此时依赖是：

```text
flag -> effect
name -> effect
```

当 `state.flag = false` 后，effect 重新执行。重新执行前先做 cleanup，把自己从 `flag` 和 `name` 的 dep 中删除。重新执行时读取的是 `state.flag` 和 `state.age`，于是依赖变成：

```text
flag -> effect
age  -> effect
```

再修改 `state.name = 'xxx'` 时，不应该打印 `runner`，因为当前页面已经不依赖 `name` 了。这就是 cleanup 的价值：让依赖关系和当前代码执行结果保持一致。

## 九、嵌套 effect 与 effect 栈

全局只能有一个当前正在收集的 `activeEffect`。如果 effect 嵌套 effect，就必须恢复父级上下文。

```ts
effect(() => {
  state.name

  effect(() => {
    state.age
  })

  state.flag
})
```

期望依赖关系：

```text
name -> outer effect
age  -> inner effect
flag -> outer effect
```

如果没有父级记录，内部 effect 执行完后，`activeEffect` 可能仍然是 inner。这样外层后续读取 `state.flag` 时，会错误收集到 inner 上。

解决方式是使用 effect 栈，或通过 `parent` 形成链式恢复：

```ts
this.parent = activeEffect
activeEffect = this

try {
  return this.fn()
} finally {
  activeEffect = this.parent
  this.parent = undefined
}
```

这就是 `parent` 或 effect stack 的意义：进入子 effect 前保存外层，退出子 effect 后恢复外层。

## 十、triggerEffects：为什么先复制再执行

触发依赖时，不能直接遍历原始 dep。

```ts
const effects = [...dep]
effects.forEach(effect => effect.run())
```

原因是 effect 重新执行时会先 cleanup，然后重新 track。这会对同一个 Set 做删除和新增。如果一边遍历 Set，一边修改 Set，可能导致重复执行或漏执行。

所以要先复制一份稳定快照。

同时 Vue3 会避免当前正在运行的 effect 同步触发自己：

```ts
if (effect !== activeEffect) {
  effect.run()
}
```

否则下面这种代码可能立即递归：

```ts
effect(() => {
  state.count++
})
```

## 十一、scheduler：把执行权交出去

默认情况下，数据变化会立即重新执行 effect。

```ts
effect(() => {
  render()
})
```

但组件更新不能每次修改都同步渲染。Vue3 会通过 scheduler 把更新任务放进队列，再统一刷新。

```ts
effect(render, {
  scheduler() {
    queueJob(renderJob)
  }
})
```

scheduler 的意义是：响应式系统只负责发现“应该更新”，具体什么时候更新、是否合并多次更新，由调度器决定。

这也是 Vue3 能做到批量更新的原因：

```ts
state.name = 'a'
state.name = 'b'
state.name = 'c'
```

多次修改可以合并成一次组件渲染。

### 11.1 scheduler 例子：数据变了，但我决定什么时候更新

```ts
const state = reactive({
  address: { n: 316 }
})

const runner = effect(
  () => {
    app.innerHTML = state.address.n
  },
  {
    scheduler: () => {
      setTimeout(() => {
        runner()
      }, 1000)
    }
  }
)

setTimeout(() => {
  state.address.n = 504
}, 1000)
```

这里 `state.address.n` 改变后，不会立刻重新执行 effect。响应式系统只会发现“这个 effect 需要更新”，然后调用 `scheduler`。真正执行更新的是 `scheduler` 里的 `runner()`。

所以 scheduler 把“依赖触发”和“实际执行”分开了：

```text
trigger 只负责通知
scheduler 决定何时执行 runner
```

组件更新队列、本轮事件循环内的批量更新、`watch` 的不同 flush 时机，都建立在这个能力上。

## 十二、stop：停止响应式订阅

`stop` 会让 effect 从所有依赖集合中移除。

```ts
const runner = effect(() => {
  console.log(state.name)
})

runner.effect.stop()
```

停止后：

```ts
state.name = 'jiang' // 不再自动触发
runner()             // 仍然可以手动执行
```

手动执行 runner 时，只执行函数本身，不应该重新建立响应式订阅。这就是 `active` 状态的作用。

## 十三、ref：让基本类型也能响应式

`reactive` 只能代理对象。基本类型没有属性可拦截，所以 Vue3 用 `ref` 包一层对象。

```ts
const count = ref(0)

effect(() => {
  console.log(count.value)
})

count.value++
```

`ref` 的核心结构：

```ts
class RefImpl {
  dep = new Set()
  __v_isRef = true

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = toReactive(newValue)
      triggerRefValue(this)
    }
  }
}
```

每个 ref 只有一个 `.value` 依赖点，所以它可以自己维护一个 `dep`，不一定要进入 `targetMap`。

如果 `ref` 包的是对象，Vue3 会把对象转成 reactive：

```ts
const user = ref({ name: 'jw' })
user.value.name // 响应式
```

### 13.1 ref 例子：基本类型也能被 effect 追踪

```ts
const flag = ref(true)

effect(() => {
  app.innerHTML = flag.value
})

setTimeout(() => {
  flag.value = false
}, 1000)
```

`flag` 是一个布尔值，不能用 `Proxy` 直接代理。`ref` 把它包装成带 `.value` 的对象：

```text
读取 flag.value -> 收集当前 effect
修改 flag.value -> 触发 dep 中的 effect
```

因此基本类型也拥有了和对象属性类似的响应式能力。

## 十四、ref 自动解包

在模板中使用 ref，不需要写 `.value`：

```vue
<template>
  <div>{{ count }}</div>
</template>
```

在 `reactive` 对象中访问 ref 属性，也会自动解包：

```ts
const count = ref(1)
const state = reactive({ count })

console.log(state.count) // 1
```

但有几个特殊点。

### 14.1 数组和集合中不会自动解包

```ts
const list = reactive([ref(1)])

console.log(list[0].value) // 需要 .value
```

`Map`、`Set` 里也类似。这样可以避免数组和集合内部值类型被隐式改变，保持行为可预测。

### 14.2 给已有 ref 属性赋普通值

如果 reactive 对象上已有属性是 ref，给它赋一个普通值时，Vue3 倾向于修改原 ref 的 `.value`，而不是替换整个 ref。

```ts
const state = reactive({
  count: ref(1)
})

state.count = 2
```

逻辑上相当于：

```ts
state.count.value = 2
```

这样可以保留原 ref 上已经收集的依赖。

## 十五、computed：懒执行、缓存和联动

`computed` 本质上是一个特殊的 ref。它也通过 `.value` 读取，也有自己的依赖集合。

```ts
const fullName = computed(() => {
  return state.firstName + state.lastName
})
```

computed 有两个核心点。

第一，懒执行。创建 computed 时不会立刻执行 getter，只有读取 `.value` 时才执行。

```ts
const fullName = computed(() => {
  console.log('run')
  return state.firstName + state.lastName
})

fullName.value // 此时才打印 run
```

第二，缓存。依赖不变时，多次读取返回缓存值。

```ts
fullName.value // 执行 getter
fullName.value // 使用缓存
fullName.value // 使用缓存
```

它通过 `_dirty` 脏标记实现。更准确地说，`_dirty` 不是在 `get value()` 里被改成 `true` 的，而是在 `computed` 内部那个 `ReactiveEffect` 的 `scheduler` 里被改的：

```ts
constructor(getter, public setter) {
  this.effect = new ReactiveEffect(getter, () => {
    if (!this._dirty) {
      this._dirty = true
      triggerEffects(this.dep)
    }
  })
}
```

这段对应的是 `example/reactivity/src/computed.ts` 里的实现。它的执行链路是：

```text
1. computed 首次读取 value
2. get value() 里执行 this.effect.run()
3. getter 过程中读取了响应式数据，依赖被收集到 getter 对应的 dep 中
4. 响应式数据变化时，triggerEffects(dep) 找到这个 computed 内部 effect
5. 由于 computed effect 配了 scheduler，不会立刻重新执行 getter
6. scheduler 先把 _dirty 改成 true，再触发 computed 自己的 dep
7. 外层使用 computed.value 的 effect 被通知后，下一次读取时才重新计算
```

对应到示例源码，最关键的两处就是：

```ts
// example/reactivity/src/computed.ts
this.effect = new ReactiveEffect(getter, () => {
  if (!this._dirty) {
    this._dirty = true
    triggerEffects(this.dep)
  }
})
```

```ts
// example/reactivity/src/computed.ts
get value() {
  trackEffects(this.dep)

  if (this._dirty) {
    this._dirty = false
    this._value = this.effect.run()
  }

  return this._value
}
```

所以这里的“脏”，本质上是一个两阶段状态：

- `false`：当前缓存有效，直接返回 `_value`
- `true`：依赖已经变了，但还没重新取值，下一次读取时再算

### 15.1 Vue3 源码里的对应关系

你本地安装的 Vue 3.5 源码已经不再用单独的 `_dirty` 布尔值来描述这件事，而是把它收进了 `ComputedRefImpl` 的标记和调度流程里，但语义是一样的。

源码里 `ComputedRefImpl` 的核心流程大致是：

```ts
class ComputedRefImpl {
  dep = new Dep(this)
  flags = 16

  notify() {
    this.flags |= 16
    batch(this, true)
  }

  get value() {
    this.dep.track()
    refreshComputed(this)
    return this._value
  }
}
```

这里的对应关系可以直接理解成：

- 你示例里的 `_dirty = true`，在 Vue 3.5 里等价于 `notify()` 把 computed 标记为需要刷新
- 你示例里的 `get value()` 中的 `if (_dirty) { ... }`，在 Vue 3.5 里变成了 `refreshComputed(this)`
- 你示例里的 `triggerEffects(this.dep)`，在 Vue 3.5 里对应把依赖 `batch` 起来，让使用这个 computed 的外层 effect 重新调度

Vue 3.5 的 `refreshComputed()` 会负责真正的重新计算：

```text
1. 先判断 computed 是否已经是脏的，或者全局版本是否变化
2. 需要刷新时，执行 computed.fn()
3. 如果返回值变化，更新 _value 和 dep.version
4. 清理本次计算过程中不再使用的依赖
```

也就是说，Vue 3.5 把“标脏”和“真正重算”拆得更细了：

- 标脏发生在依赖变化后的通知阶段
- 重算发生在下一次读取 `computed.value` 时

你可以把两版实现一一对上：

| 简化版 example/reactivity | Vue 3.5 源码 |
| --- | --- |
| `_dirty = true` | `notify()` / `flags |= 16` |
| `get value()` 里判断 `_dirty` | `refreshComputed(this)` |
| `triggerEffects(this.dep)` | `batch(this, true)` 后驱动外层订阅者刷新 |

```ts
if (_dirty) {
  _dirty = false
  _value = effect.run()
}
return _value
```

当依赖变化时，computed 内部 effect 的 scheduler 不会立即重新计算，而是：

```text
把 _dirty 改为 true
触发依赖 computed.value 的外层 effect
等下次读取 computed.value 时再重新计算
```

如果 computed 被渲染 effect 使用：

```ts
effect(() => {
  document.body.innerHTML = fullName.value
})
```

依赖变化链路是：

```text
state.firstName 改变
-> 触发 computed 内部 effect 的 scheduler
-> computed 标记为 dirty
-> 触发使用 fullName.value 的渲染 effect
-> 渲染 effect 重新读取 fullName.value
-> computed 重新计算
```

computed 也可以传入 getter 和 setter：

```ts
const fullName = computed({
  get() {
    return state.firstName + state.lastName
  },
  set(value) {
    state.firstName = value
  }
})
```

只有 getter 的 computed 是只读的，直接赋值会触发警告。

### 15.1 computed 例子：依赖变化后先标脏，再重新取值

```ts
const state = reactive({
  firstname: 'a',
  lastname: 'b'
})

const fullname = computed({
  get() {
    console.log('getter')
    return state.firstname + state.lastname
  },
  set(value) {
    console.log(value)
  }
})

effect(() => {
  app.innerHTML = fullname.value
})

setTimeout(() => {
  state.firstname = 'hello'
}, 1000)
```

初始化时，渲染 effect 读取 `fullname.value`，computed 的 getter 第一次执行，打印 `getter`，并收集 `firstname`、`lastname`。

当 `state.firstname = 'hello'` 后，computed 不会马上重新执行 getter，而是先把自己标记为脏：

```text
firstname 变化
-> computed 内部 effect 的 scheduler 执行
-> dirty = true
-> 通知依赖 fullname.value 的渲染 effect
-> 渲染 effect 重新读取 fullname.value
-> dirty 为 true，getter 才重新执行
```

这就是 computed 能缓存的原因：只要依赖没变，多次读取都不重新计算；依赖变了，也是在下一次读取时才计算。

## 十六、watchEffect：自动收集依赖，但不是简单的 effect

`watchEffect` 的特点是“不需要声明监听谁”。它会立即执行传入函数，函数运行过程中读取了哪些响应式数据，就自动订阅哪些数据。

```ts
const state = reactive({ name: 'jw', age: 30 })

const stop = watchEffect((onCleanup) => {
  console.log(state.name)

  onCleanup(() => {
    console.log('下一次执行前，先清理上一次副作用')
  })
})
```

第一次执行时读取 `state.name`，因此会收集：

```text
name -> watchEffect 内部的 ReactiveEffect
```

之后 `state.name` 变化，`watchEffect` 会重新执行；`state.age` 变化则不会执行，因为函数里没有读取 `age`。

### 16.1 watchEffect 的伪代码

`watchEffect(fn)` 可以理解为 `watch(fn, null)`。没有回调，也没有新旧值比较。

```ts
function watchEffect(source, options) {
  return doWatch(source, null, options)
}

function doWatch(source, cb, options) {
  let cleanup

  const onCleanup = (fn) => {
    cleanup = fn
  }

  const getter = () => {
    if (cleanup) {
      pauseTracking()
      cleanup()
      resetTracking()
    }

    return source(onCleanup)
  }

  const effect = new ReactiveEffect(getter)
  effect.scheduler = createScheduler(options.flush)

  effect.run()

  return () => effect.stop()
}
```

这里有几个关键点。

第一，`watchEffect` 的 source 本身就是 getter。它执行时读取到什么，就收集什么。

第二，清理函数会在下一次执行前调用，不是在本次执行后立刻调用。

第三，执行 cleanup 时会暂停依赖收集。因为 cleanup 只是清理旧副作用，不应该把 cleanup 中读取到的数据也收集成 watchEffect 的依赖。

### 16.2 watchEffect 的依赖会动态变化

```ts
const state = reactive({
  flag: true,
  name: 'jw',
  age: 30
})

watchEffect(() => {
  console.log(state.flag ? state.name : state.age)
})
```

第一次 `flag` 为 `true`：

```text
flag -> effect
name -> effect
```

当 `state.flag = false` 后，watchEffect 重新执行，旧依赖会被清理，再重新收集：

```text
flag -> effect
age  -> effect
```

此后修改 `state.name` 不应该再触发这个 watchEffect。这和前面讲的 `cleanupEffect` 是同一个底层逻辑。

## 十七、watch：指定数据源、新旧值和触发条件

`watch` 和 `watchEffect` 最大区别是：`watch` 的依赖来自 source，副作用写在 callback 中。

```ts
watch(
  () => state.age,
  (newValue, oldValue, onCleanup) => {
    console.log(newValue, oldValue)
  }
)
```

它的执行模型是：

```text
把 source 统一包装成 getter
创建 lazy effect，但先执行一次 getter 得到 oldValue
source 依赖变化时触发 scheduler
scheduler 执行 job
job 重新执行 getter 得到 newValue
比较 newValue 和 oldValue
确实变化后执行 callback
oldValue = newValue
```

### 17.1 watch 支持哪些 source

```ts
watch(refValue, cb)
watch(() => state.name, cb)
watch(reactiveObject, cb)
watch([refValue, () => state.name], cb)
```

伪代码如下：

```ts
function createGetter(source) {
  if (isRef(source)) {
    return () => source.value
  }

  if (isReactive(source)) {
    return () => traverse(source)
  }

  if (Array.isArray(source)) {
    return () => source.map(item => {
      if (isRef(item)) return item.value
      if (isReactive(item)) return traverse(item)
      if (isFunction(item)) return item()
    })
  }

  if (isFunction(source)) {
    return source
  }
}
```

监听 reactive 对象时需要 `traverse`，因为只写 `watch(obj, cb)` 并没有读取某个具体属性。为了让深层属性都能被依赖收集，Vue 会主动深度读取。

```ts
function traverse(value, seen = new Set()) {
  if (!isObject(value) || seen.has(value)) return value
  seen.add(value)

  if (isRef(value)) {
    traverse(value.value, seen)
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen)
    }
  } else if (value instanceof Map || value instanceof Set) {
    value.forEach(v => traverse(v, seen))
  } else {
    for (const key in value) {
      traverse(value[key], seen)
    }
  }

  return value
}
```

`seen` 是为了防止循环引用：

```ts
const obj: any = {}
obj.self = obj
watch(obj, cb)
```

没有 `seen`，这里会无限递归。

### 17.2 watch 的 job 伪代码

```ts
let oldValue = INITIAL_VALUE

const job = () => {
  const newValue = effect.run()

  if (deep || forceTrigger || hasChanged(newValue, oldValue)) {
    if (cleanup) cleanup()

    cb(newValue, oldValue === INITIAL_VALUE ? undefined : oldValue, onCleanup)

    oldValue = newValue
  }
}

const effect = new ReactiveEffect(getter)
effect.scheduler = job

oldValue = effect.run()
```

这里的 `forceTrigger` 用于处理 shallow ref、reactive 对象等场景。因为有些变化并不能只靠 `Object.is(newValue, oldValue)` 判断。

## 十八、watch 的 cleanup：解决异步竞态

搜索框是最典型的例子。用户连续输入时，旧请求可能比新请求更晚返回。如果不处理，旧结果会覆盖新结果。

```ts
const state = reactive({ keyword: '' })
const list = ref([])

watch(
  () => state.keyword,
  async (keyword, oldKeyword, onCleanup) => {
    let valid = true

    onCleanup(() => {
      valid = false
    })

    const result = await search(keyword)

    if (valid) {
      list.value = result
    }
  }
)
```

连续修改：

```ts
state.keyword = 'v'
state.keyword = 'vu'
state.keyword = 'vue'
```

每次新 callback 执行前，都会先执行上一次注册的 cleanup：

```text
keyword = 'v'   -> 发起请求 A，注册 cleanupA
keyword = 'vu'  -> 执行 cleanupA，让 A 失效；发起请求 B
keyword = 'vue' -> 执行 cleanupB，让 B 失效；发起请求 C
```

即使 A 最后才返回，也会因为 `valid === false` 被忽略。这个例子没有真正取消 Promise，只是屏蔽过期结果。真实请求可以配合 `AbortController`：

```ts
watch(
  () => state.keyword,
  async (keyword, oldKeyword, onCleanup) => {
    const controller = new AbortController()

    onCleanup(() => {
      controller.abort()
    })

    const res = await fetch(`/api/search?q=${keyword}`, {
      signal: controller.signal
    })
  }
)
```

## 十九、flush：watch 什么时候执行

`watch` 和 `watchEffect` 的触发不是只有“同步执行”一种。Vue 组件更新本身也在调度队列里，所以 watch 必须能选择执行时机。

```ts
watch(source, cb, { flush: 'pre' })
watch(source, cb, { flush: 'post' })
watch(source, cb, { flush: 'sync' })
```

三种模式：

```text
pre  默认值，组件更新前执行，任务进入 queueJob
post 组件 DOM 更新后执行，任务进入 queuePostRenderEffect
sync 同步执行，不排队
```

伪代码：

```ts
if (flush === 'post') {
  scheduler = job => queuePostRenderEffect(job)
} else if (flush === 'sync') {
  scheduler = job => job()
} else {
  scheduler = (job, isFirstRun) => {
    if (isFirstRun) job()
    else queueJob(job)
  }
}
```

使用建议：

- 只关心数据变化：默认 `pre`。
- 回调里要读取更新后的 DOM：用 `post`。
- 必须立即执行，并且能接受频繁触发成本：用 `sync`。

## 二十、数组响应式：索引、length 和迭代依赖

数组的难点是：一次操作往往会同时影响索引、`length` 和迭代结果。

先看 Vue 内部会给数组建立几类依赖：

```text
arr[0]                  -> key: '0'
arr.length              -> key: 'length'
for...of / [...arr]     -> key: ARRAY_ITERATE_KEY
Object.keys(arr)        -> key: 'length'
arr.includes(x)         -> key: ARRAY_ITERATE_KEY
```

其中 `ARRAY_ITERATE_KEY` 是数组迭代依赖。它表示“我关心数组整体迭代结果”，不只是某一个下标。

### 20.1 读取数组时收集什么

```ts
const arr = reactive(['a', 'b'])

effect(() => {
  console.log(arr[0])
})
```

读取 `arr[0]`，收集：

```text
'0' -> effect
```

读取长度：

```ts
effect(() => {
  console.log(arr.length)
})
```

收集：

```text
'length' -> effect
```

迭代数组：

```ts
effect(() => {
  console.log([...arr])
})
```

会通过数组迭代方法收集：

```text
ARRAY_ITERATE_KEY -> effect
```

`Object.keys(arr)` 不是普通迭代，它会触发 `ownKeys`，Vue 对数组的 `ownKeys` 收集 `length`：

```ts
ownKeys(target) {
  track(target, 'iterate', isArray(target) ? 'length' : ITERATE_KEY)
  return Reflect.ownKeys(target)
}
```

所以：

```ts
effect(() => {
  console.log(Object.keys(arr))
})
```

收集的是：

```text
'length' -> effect
```

### 20.2 arr.push(1) 到底触发哪些依赖

```ts
const arr = reactive([])

effect(() => console.log('length:', arr.length))
effect(() => console.log('first:', arr[0]))
effect(() => console.log('iterate:', [...arr]))

arr.push(1)
```

从 JS 行为看，`push(1)` 相当于：

```text
arr[0] = 1
arr.length = 1
```

但 Vue 不能简单依赖原生行为。它会对 `push` 做包裹：

```ts
arrayInstrumentations.push = function (...args) {
  return noTracking(this, 'push', args)
}

function noTracking(self, method, args) {
  pauseTracking()
  startBatch()

  const res = toRaw(self)[method].apply(self, args)

  endBatch()
  resetTracking()
  return res
}
```

这里有三层特殊处理。

第一，`toRaw(self)` 取出原数组上的原生方法，再用代理对象作为 `this` 执行。这样方法内部的索引写入、`length` 写入仍然会经过代理拦截，但不会因为访问到被改写的数组方法而递归。

第二，`pauseTracking()` 暂停依赖收集。因为 `push` 内部会读取 `length` 来决定插入位置，如果当前正在某个 effect 里调用 `push`，这个内部读取不应该被收集，否则容易制造多余依赖甚至递归。

第三，`startBatch()` 和 `endBatch()` 批量触发。`push` 可能触发索引和长度两个更新，批处理可以把多次触发合并。

真正触发时，核心在 `trigger` 的数组分支：

```ts
function trigger(target, type, key, newValue) {
  const targetIsArray = Array.isArray(target)
  const isArrayIndex = targetIsArray && isIntegerKey(key)

  if (targetIsArray && key === 'length') {
    const newLength = Number(newValue)

    depsMap.forEach((dep, depKey) => {
      if (
        depKey === 'length' ||
        depKey === ARRAY_ITERATE_KEY ||
        depKey >= newLength
      ) {
        run(dep)
      }
    })
  } else {
    run(depsMap.get(key))

    if (isArrayIndex) {
      run(depsMap.get(ARRAY_ITERATE_KEY))
    }

    if (type === 'add' && isArrayIndex) {
      run(depsMap.get('length'))
    }
  }
}
```

对于空数组 `arr.push(1)`：

```text
新增下标 0
-> 触发 key '0' 的依赖
-> 触发 ARRAY_ITERATE_KEY 的依赖
-> 因为是新增数组索引，触发 length 的依赖
```

所以三个 effect 都会更新：

```text
arr[0]      依赖更新
arr.length  依赖更新
[...arr]    依赖更新
```

注意：原生 `push` 后面还会设置 `length`。但当索引 `0` 设置完成后，数组长度已经变成 1，再设置 `length = 1` 时，新旧值没有变化。因此 Vue 必须在“新增数组索引”这个分支里主动触发 `length` 依赖，否则依赖 `length` 的 effect 会漏更新。

### 20.3 arr.pop() 怎么处理

```ts
const arr = reactive([1, 2, 3])

effect(() => console.log(arr.length))
effect(() => console.log(arr[2]))
effect(() => console.log([...arr]))

arr.pop()
```

`pop()` 相当于：

```text
delete arr[2]
arr.length = 2
```

触发关系：

```text
delete index 2
-> 触发 key '2'
-> 触发 ARRAY_ITERATE_KEY

set length = 2
-> 触发 length
-> 触发 ARRAY_ITERATE_KEY
-> 触发所有 index >= 2 的依赖
```

为什么设置 `length` 要触发 `index >= newLength`？

```ts
const arr = reactive([1, 2, 3])

effect(() => {
  console.log(arr[2])
})

arr.length = 2
```

`arr[2]` 被截掉了。如果不触发下标 `2` 的依赖，effect 里看到的值就不会从 `3` 更新成 `undefined`。

### 20.4 shift、unshift、splice 分别影响什么

这些方法都会改变数组长度，也会改变很多下标。

```text
push      新增尾部索引，length 增加
pop       删除尾部索引，length 减少
unshift   新增头部元素，原有索引整体后移，length 增加
shift     删除头部元素，原有索引整体前移，length 减少
splice    可新增、删除、替换任意区间，可能改变 length
```

Vue 对这些会修改长度的方法统一走 `noTracking`：

```ts
push(...args)    { return noTracking(this, 'push', args) }
pop()            { return noTracking(this, 'pop') }
shift()          { return noTracking(this, 'shift') }
unshift(...args) { return noTracking(this, 'unshift', args) }
splice(...args)  { return noTracking(this, 'splice', args) }
```

原因一样：这些方法内部都会读写 `length`，如果不暂停内部依赖收集，容易产生不必要依赖；如果不批处理，可能一次操作触发很多次 effect。

例如 `unshift(0)`：

```ts
const arr = reactive([1, 2])

effect(() => console.log(arr[0]))
effect(() => console.log(arr[1]))
effect(() => console.log(arr.length))

arr.unshift(0)
```

结果：

```text
arr[0] 从 1 变成 0 -> 触发 key '0'
arr[1] 从 2 变成 1 -> 触发 key '1'
新增 arr[2]       -> 触发 key '2'、ARRAY_ITERATE_KEY、length
```

这些触发会被 batch 包住，最后统一刷新。

`splice` 更复杂：

```ts
arr.splice(1, 2, 'x', 'y', 'z')
```

它可能同时做：

```text
删除旧索引
写入新索引
移动后续索引
更新 length
触发数组迭代依赖
```

所以 Vue 不为每个数组方法手写完整逻辑，而是让原生数组方法通过代理触发 `set/delete/length`，再由统一的 `trigger` 数组分支决定该通知哪些依赖。

### 20.5 直接设置 length 的特殊分支

```ts
const arr = reactive([1, 2, 3, 4])

effect(() => console.log(arr.length))
effect(() => console.log(arr[1]))
effect(() => console.log(arr[3]))
effect(() => console.log([...arr]))

arr.length = 2
```

触发：

```text
length effect       触发，因为 length 变了
arr[1] effect       不触发，因为 index 1 仍然存在
arr[3] effect       触发，因为 index 3 被截掉
ARRAY_ITERATE_KEY   触发，因为数组迭代结果变了
```

这就是源码里 `depKey >= newLength` 的含义。

### 20.6 includes / indexOf / lastIndexOf 为什么要用 toRaw

数组查找还有代理身份问题。

```ts
const raw = { id: 1 }
const proxy = reactive(raw)
const arr = reactive([raw])

console.log(arr.includes(proxy)) // 应该是 true
```

原生 `includes` 用的是引用相等。`raw !== proxy`，所以直接查会失败。Vue 会做两次查找：

```ts
function searchProxy(self, method, args) {
  const rawArr = toRaw(self)

  track(rawArr, 'iterate', ARRAY_ITERATE_KEY)

  const res = rawArr[method](...args)

  if ((res === false || res === -1) && isProxy(args[0])) {
    args[0] = toRaw(args[0])
    return rawArr[method](...args)
  }

  return res
}
```

第一次用传入值查；如果失败，并且传入值是代理对象，就转成原始对象再查一次。

这就是 `toRaw` 在数组查找里的价值：解决“数组里存 raw，用户拿 proxy 查”导致的身份不一致。

## 二十一、toRaw：拿回原始对象，但不能滥用

`toRaw` 的作用是从代理对象取回原始对象。

```ts
const raw = { name: 'jw' }
const proxy = reactive(raw)

console.log(toRaw(proxy) === raw) // true
```

伪代码：

```ts
function toRaw(observed) {
  const raw = observed && observed.__v_raw
  return raw ? toRaw(raw) : observed
}
```

它是递归的，因为可能存在多层代理：

```ts
const readonlyProxy = readonly(reactive(raw))
toRaw(readonlyProxy) === raw
```

### 21.1 toRaw 在 set 中的作用

设置响应式属性时，Vue 会把新旧值都转成 raw 再比较和存储，避免代理对象污染原始数据结构。

```ts
set(target, key, value, receiver) {
  let oldValue = target[key]

  if (!isShallow(value) && !isReadonly(value)) {
    oldValue = toRaw(oldValue)
    value = toRaw(value)
  }

  const result = Reflect.set(target, key, value, receiver)

  if (hasChanged(value, oldValue)) {
    trigger(target, 'set', key, value, oldValue)
  }

  return result
}
```

例子：

```ts
const raw = { id: 1 }
const proxy = reactive(raw)
const state = reactive({ item: null })

state.item = proxy
```

Vue 倾向于把 `toRaw(proxy)` 存进去，避免原始对象里混入代理对象。

### 21.2 toRaw 会绕过响应式

```ts
const state = reactive({ name: 'jw' })
const raw = toRaw(state)

effect(() => {
  console.log(state.name)
})

raw.name = 'jiang'
```

直接修改 raw 不会经过 proxy 的 `set`，所以不会触发更新。`toRaw` 适合做临时比较、传给第三方库、解决代理身份问题，不适合长期持有后直接修改。

## 二十二、对象迭代：ITERATE_KEY

对象迭代依赖不是某个具体 key。

```ts
const state = reactive({ name: 'jw' })

effect(() => {
  console.log(Object.keys(state))
})
```

这里关心的是“对象有哪些 key”。读取时会触发 `ownKeys`：

```ts
ownKeys(target) {
  track(target, 'iterate', ITERATE_KEY)
  return Reflect.ownKeys(target)
}
```

新增或删除属性时，要触发 `ITERATE_KEY`：

```ts
state.age = 30
delete state.name
```

伪代码：

```ts
if (type === 'add' || type === 'delete') {
  run(depsMap.get(ITERATE_KEY))
}
```

但修改已有属性不需要触发对象迭代：

```ts
state.name = 'jiang'
```

因为 key 列表没有变，`Object.keys(state)` 的结果不变。

## 二十三、Map 和 Set：方法劫持与两类迭代依赖

`Map`、`Set` 不能只靠普通对象的 `get/set` 处理，因为数据变化发生在方法里。

```ts
const map = reactive(new Map())

effect(() => {
  console.log(map.size)
})

map.set('name', 'jw')
```

Vue 会为集合类型使用专门的 collection handlers。核心方法包括：

```text
get
has
add
set
delete
clear
forEach
keys
values
entries
Symbol.iterator
```

### 23.1 size 依赖

读取 `map.size` 时，收集的是迭代依赖：

```ts
get size() {
  const target = this.__v_raw
  track(toRaw(target), 'iterate', ITERATE_KEY)
  return target.size
}
```

为什么是迭代依赖？因为 `size` 关心集合元素数量，新增、删除、清空都会影响它。

### 23.2 Map 的 key 迭代和值迭代要分开

```ts
effect(() => {
  console.log([...map.keys()])
})

effect(() => {
  console.log([...map.values()])
})
```

这两个 effect 关心的东西不同。

```text
map.keys()   -> MAP_KEY_ITERATE_KEY
map.values() -> ITERATE_KEY
map.entries() / for...of map -> ITERATE_KEY
```

为什么要分开？看这个例子：

```ts
const map = reactive(new Map([['name', 'jw']]))

effect(() => console.log([...map.keys()]))
effect(() => console.log([...map.values()]))

map.set('name', 'jiang')
```

这里只修改已有 key 的 value。`keys()` 的结果还是 `['name']`，不应该重新触发 key 迭代 effect；`values()` 的结果变了，应该触发值迭代 effect。

新增 key 时：

```ts
map.set('age', 30)
```

这会同时影响 key 列表、value 列表、`size`，因此会触发 `MAP_KEY_ITERATE_KEY` 和 `ITERATE_KEY`。

### 23.3 Map/Set 中也需要 toRaw

集合的 key 可能是代理对象，也可能是原始对象。

```ts
const raw = { id: 1 }
const proxy = reactive(raw)
const map = reactive(new Map())

map.set(proxy, 'value')
console.log(map.get(raw))
```

Vue 在 `get/has/set/delete` 中会把 key 转成 raw 参与查找，避免同一个对象的 raw 和 proxy 被当作两个完全不同的 key。

伪代码：

```ts
function get(key) {
  const target = this.__v_raw
  const rawTarget = toRaw(target)
  const rawKey = toRaw(key)

  track(rawTarget, 'get', rawKey)

  if (target.has(key)) return wrap(target.get(key))
  if (target.has(rawKey)) return wrap(target.get(rawKey))
}
```

开发环境下，如果同一个 Map 同时存在 raw key 和 proxy key，Vue 还会警告，因为这会造成数据不一致。

## 二十四、readonly、shallow 和 ref 赋值的特殊处理

Vue3 不只有 `reactive`。

```ts
readonly(obj)
shallowReactive(obj)
shallowReadonly(obj)
```

`readonly` 的 set/delete 不会真正修改数据，开发环境会给出警告。

```ts
const state = readonly({ name: 'jw' })
state.name = 'jiang' // 警告，修改失败
```

`shallowReactive` 只处理第一层：

```ts
const state = shallowReactive({
  user: { name: 'jw' }
})

effect(() => console.log(state.user.name))

state.user.name = 'jiang' // 不触发
state.user = { name: 'new' } // 触发
```

还有一个容易忽略的点：reactive 对象属性原本是 ref，赋普通值时不会替换 ref，而是修改 `.value`。

```ts
const count = ref(1)
const state = reactive({ count })

state.count = 2
```

伪代码：

```ts
if (!isArrayIndex && isRef(oldValue) && !isRef(value)) {
  oldValue.value = value
  return true
}
```

这样做可以保留原 ref 的依赖关系。

数组下标是例外：

```ts
const arr = reactive([ref(1)])
arr[0] // 仍然是 ref，不自动解包
```

数组和集合中不自动解包 ref，是为了避免容器元素类型被隐式改变。

## 二十五、新旧值比较与 NaN

触发更新前要判断值是否真的变化。不能简单使用 `!==`：

```ts
NaN !== NaN // true
```

Vue 使用类似 `Object.is` 的判断：

```ts
function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue)
}
```

这样重复设置 `NaN` 不会误触发：

```ts
state.value = NaN
state.value = NaN // 不应该再次触发
```

## 二十六、完整链路回顾

以渲染更新为例：

```ts
const state = reactive({ name: 'jw', age: 30 })

effect(() => {
  document.body.innerHTML = state.name + state.age
})

state.name = 'jiang'
```

初始化阶段：

```text
reactive 创建 proxy
effect 创建 ReactiveEffect
run 开始执行
activeEffect 指向当前 effect
读取 state.name -> get -> track name
读取 state.age  -> get -> track age
run 结束，恢复上一个 activeEffect
```

更新阶段：

```text
修改 state.name
set 拦截
判断值发生变化
trigger name
取出 name 对应的 effects
如果有 scheduler，交给 scheduler
否则执行 effect.run()
cleanupEffect 清理旧依赖
重新执行副作用函数
重新收集最新依赖
页面更新
```

## 二十七、理解 Vue3 响应式的关键点

掌握 Vue3 响应式，重点不是记住每个 API，而是理解下面这些关系：

```text
reactive 用 Proxy 代理对象
ref 用 .value 包装基本类型
effect 是所有响应式更新的执行单元
track 在读取时建立依赖
trigger 在修改时触发依赖
deps 让 effect 能反向清理自己
cleanupEffect 解决条件分支导致的过期依赖
effect stack 解决嵌套 effect 的上下文恢复
scheduler 让更新进入队列，实现批量调度
computed = lazy effect + dirty 缓存 + ref-like 接口
watch = lazy effect + scheduler + 新旧值 + cleanup
数组、对象迭代、Map、Set 需要额外依赖类型
```

响应式系统的本质是依赖图维护。Vue3 做的事情，就是在运行代码时动态维护这张图，并在数据变化时让图上相关节点重新执行。
