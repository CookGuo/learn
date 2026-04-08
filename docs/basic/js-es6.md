# ES6+ 新特性

ES6（ES2015）及后续版本带来了大量语法改进和新特性，让 JavaScript 更强大、更易用。

## let 与 const

```javascript
// let - 块级作用域变量
if (true) {
  let x = 10;
  console.log(x);  // 10
}
console.log(x);    // ReferenceError

// const - 常量，不能重新赋值
const PI = 3.14159;
PI = 3;  // TypeError

// const 对象可以修改属性
const user = { name: 'John' };
user.name = 'Jane';  // OK
user = {};           // TypeError
```

## 箭头函数

```javascript
// 简洁语法
const add = (a, b) => a + b;
const square = x => x * x;

// this 继承外层作用域
const obj = {
  value: 42,
  getValue: function() {
    setTimeout(() => {
      console.log(this.value);  // 42，箭头函数没有自己的 this
    }, 100);
  }
};

// 不适用场景：需要动态 this 时
const button = document.getElementById('btn');
button.addEventListener('click', function() {
  console.log(this);  // button 元素
});
```

## 解构赋值

```javascript
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4, 5];
// a = 1, b = 2, rest = [3, 4, 5]

// 对象解构
const { name, age = 18 } = { name: 'John' };
// name = 'John', age = 18 (默认值)

// 嵌套解构
const { user: { email } } = { user: { email: 'john@example.com' } };

// 重命名
const { name: userName } = { name: 'John' };

// 函数参数解构
function createUser({ name, age, role = 'user' }) {
  return { name, age, role };
}

// 交换变量
[x, y] = [y, x];
```

## 模板字符串

```javascript
const name = 'World';
const message = `Hello, ${name}!`;

// 多行字符串
const html = `
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
`;

// 标签模板
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<b>${values[i]}</b>` : '');
  }, '');
}

const result = highlight`Hello ${name}, welcome!`;
```

## 展开运算符

```javascript
// 数组展开
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];  // [1, 2, 3, 4]

// 对象展开
const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 };  // { a: 1, b: 2 }

// 函数参数
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);  // 10

// 复制数组/对象（浅拷贝）
const copy = [...original];
const objCopy = { ...original };
```

## 类与模块

```javascript
// 类
class Animal {
  static count = 0;
  
  constructor(name) {
    this.name = name;
    Animal.count++;
  }
  
  speak() {
    console.log(`${this.name} speaks`);
  }
  
  static getCount() {
    return Animal.count;
  }
}

class Dog extends Animal {
  speak() {
    super.speak();
    console.log(`${this.name} barks`);
  }
}

// 模块导出
// math.js
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default class Calculator { }

// 模块导入
import Calculator, { PI, add } from './math.js';
import * as math from './math.js';
```

## 新数据结构

```javascript
// Map - 键可以是任意类型
const map = new Map();
map.set('key', 'value');
map.set(obj, 'object key');
map.get('key');  // 'value'
map.has('key');  // true
map.delete('key');
map.size;        // 0

// Set - 唯一值集合
const set = new Set([1, 2, 2, 3]);
set.add(4);
set.has(2);      // true
set.delete(2);
const unique = [...set];  // [1, 2, 3]

// WeakMap/WeakSet - 弱引用，支持垃圾回收
const weakMap = new WeakMap();
weakMap.set(obj, 'data');  // obj 被回收时，条目自动移除
```

## 其他实用特性

```javascript
// 可选链操作符
const userCity = user?.address?.city;

// 空值合并运算符
const value = null ?? 'default';  // 'default'
const zero = 0 ?? 'default';      // 0

// 逻辑赋值运算符
a ??= b;  // a = a ?? b
a &&= b;  // a = a && b
a ||= b;  // a = a || b

// 动态导入
const module = await import('./module.js');

// BigInt
const big = 123456789012345678901234567890n;

// Promise.allSettled, Promise.any 等
```

::: tip 学习建议
- 使用 Babel 转换代码以支持旧浏览器
- 逐步采用新特性，保持代码可读性
- 关注 [TC39](https://tc39.es/) 了解最新提案
:::
