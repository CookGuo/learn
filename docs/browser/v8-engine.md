# V8 工作原理

V8 是 Google 开发的 JavaScript 引擎，用于 Chrome 和 Node.js。它将 JavaScript 代码编译为机器码执行，而非解释执行。

## V8 架构

```
┌─────────────────────────────────────┐
│           JavaScript 源码            │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│           Parser (解析器)            │
│     生成 AST (抽象语法树)            │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│        Ignition (解释器)             │
│     生成字节码并执行                 │
└─────────────┬───────────────────────┘
              ▼
┌─────────────────────────────────────┐
│        TurboFan (优化编译器)         │
│     热点代码编译为机器码             │
└─────────────────────────────────────┘
```

## 编译流程

### 1. 解析阶段

```javascript
// 源码
function add(a, b) {
  return a + b;
}

// AST 表示
{
  "type": "FunctionDeclaration",
  "id": { "type": "Identifier", "name": "add" },
  "params": [
    { "type": "Identifier", "name": "a" },
    { "type": "Identifier", "name": "b" }
  ],
  "body": {
    "type": "BlockStatement",
    "body": [{
      "type": "ReturnStatement",
      "argument": {
        "type": "BinaryExpression",
        "operator": "+",
        "left": { "type": "Identifier", "name": "a" },
        "right": { "type": "Identifier", "name": "b" }
      }
    }]
  }
}
```

### 2. 字节码生成

Ignition 解释器将 AST 转换为字节码：

```
LdaSmi [1]          ; 加载小整数 1
Star r0             ; 存储到寄存器 r0
Ldar a0             ; 加载参数 a
Add r0, [0]         ; 与 r0 相加
Return              ; 返回结果
```

### 3. 优化编译

TurboFan 对热点代码进行优化编译：

```javascript
function sum(n) {
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += i;
  }
  return result;
}

// 多次调用后触发优化
for (let i = 0; i < 10000; i++) {
  sum(100);
}
```

## 隐藏类与属性访问优化

V8 使用隐藏类（Hidden Class）优化对象属性访问：

```javascript
// 创建对象时 V8 会创建隐藏类
const obj = { x: 1, y: 2 };  // 隐藏类 C0

// 相同结构的对象共享隐藏类
const obj2 = { x: 3, y: 4 }; // 复用 C0

// 添加新属性会创建新隐藏类
obj.z = 3;  // 创建隐藏类 C1（过渡）
```

::: tip 优化建议
保持对象结构一致，避免动态添加属性，可以获得更好的性能。
:::

## 垃圾回收

V8 使用分代垃圾回收策略：

- **新生代**：存放临时对象，使用 Scavenge 算法
- **老生代**：存放存活时间久的对象，使用 Mark-Sweep-Compact 算法

```javascript
// 新生代 → 老生代晋升
function createObjects() {
  for (let i = 0; i < 1000; i++) {
    const obj = { data: new Array(1000) };
    // 多次 GC 后存活的对象会晋升到老生代
  }
}
```
