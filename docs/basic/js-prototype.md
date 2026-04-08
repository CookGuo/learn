# 原型与原型链

JavaScript 使用原型（Prototype）实现继承，这是理解 JavaScript 对象系统的核心。

## 原型基础

```javascript
// 每个对象都有 __proto__ 属性，指向其原型
const obj = {};
console.log(obj.__proto__ === Object.prototype); // true

// 每个函数都有 prototype 属性
function Person(name) {
  this.name = name;
}

// Person.prototype 是实例的原型
const alice = new Person('Alice');
console.log(alice.__proto__ === Person.prototype); // true
```

## 原型链

```javascript
// 原型链：alice → Person.prototype → Object.prototype → null

function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name);  // 继承父类实例属性
  this.breed = breed;
}

// 建立原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
  console.log(`${this.name} barks`);
};

const dog = new Dog('Rex', 'Golden Retriever');
dog.speak();  // Rex barks
```

## 原型链图解

```
dog (实例)
  │ __proto__
  ▼
Dog.prototype
  │ speak() { dog 版本 }
  │ __proto__
  ▼
Animal.prototype
  │ speak() { animal 版本 }
  │ __proto__
  ▼
Object.prototype
  │ toString(), hasOwnProperty()...
  │ __proto__
  ▼
  null
```

## 属性查找规则

```javascript
function Foo() {
  this.a = 1;
}

Foo.prototype.b = 2;

const foo = new Foo();
foo.c = 3;

console.log(foo.a);  // 1 - 实例自身属性
console.log(foo.b);  // 2 - 原型链上查找
console.log(foo.c);  // 3 - 实例自身属性
console.log(foo.d);  // undefined - 查找到 Object.prototype 仍无此属性

// hasOwnProperty 检查自有属性
console.log(foo.hasOwnProperty('a'));  // true
console.log(foo.hasOwnProperty('b'));  // false
```

## class 语法糖

ES6 class 本质仍是原型继承：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
  
  // 静态方法
  static isAnimal(obj) {
    return obj instanceof Animal;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // 调用父类构造函数
    this.breed = breed;
  }
  
  speak() {
    super.speak();  // 调用父类方法
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog('Rex', 'Golden');
dog.speak();
```

class 实际上编译为：

```javascript
// 等同于上面的 class 写法
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() { ... };

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function() { ... };
```

## 原型操作

```javascript
// Object.create - 以指定对象为原型创建新对象
const proto = { x: 1 };
const obj = Object.create(proto);
console.log(obj.x);  // 1

// Object.getPrototypeOf - 获取原型
console.log(Object.getPrototypeOf(obj) === proto);  // true

// Object.setPrototypeOf - 设置原型（影响性能，慎用）
const newProto = { y: 2 };
Object.setPrototypeOf(obj, newProto);

// Object.keys/values/entries - 只遍历自有属性
Object.keys(obj);     // []
Object.values(obj);   // []

// for...in - 遍历原型链上所有可枚举属性
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key);  // 只处理自有属性
  }
}
```

::: tip 最佳实践
- 优先使用 class 语法，更清晰易读
- 避免在运行中修改对象原型
- 使用 Object.create(null) 创建纯字典对象
:::
