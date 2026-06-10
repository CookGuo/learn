# 浏览器工作原理

浏览器是前端开发者最重要的运行环境之一。理解它的架构、执行机制、页面渲染和网络通信方式，可以帮助我们更准确地写代码，也更快定位性能和兼容性问题。

## 📋 内容概览

本模块共 35 篇文章，分为 6 个部分：

### 宏观视角上的浏览器
- [Chrome架构：仅仅打开了1个页面，为什么有4个进程](./guide/part01/lesson01)
- [TCP协议：如何保证页面文件能被完整送达浏览器](./guide/part01/lesson02)
- [HTTP请求流程：为什么很多站点第二次打开速度会很快](./guide/part01/lesson03)
- [导航流程：从输入URL到页面展示这中间发生了什么](./guide/part01/lesson04)
- [渲染流程（上）：HTML、CSS和JavaScript是如何变成页面的](./guide/part01/lesson05)
- [渲染流程（下）：HTML、CSS和JavaScript是如何变成页面的](./guide/part01/lesson06)

### 浏览器中的JavaScript执行机制
- [变量提升：JavaScript代码是按顺序执行的吗](./guide/part02/lesson07)
- [调用栈：为什么JavaScript代码会出现栈溢出](./guide/part02/lesson08)
- [块级作用域：var缺陷以及为什么要引入let和const](./guide/part02/lesson09)
- [作用域链和闭包：代码中出现相同的变量，JavaScript引擎如何选择](./guide/part02/lesson10)
- [this：从JavaScript执行上下文视角讲this](./guide/part02/lesson11)

### V8工作原理
- [栈空间和堆空间：数据是如何存储的](./guide/part03/lesson12)
- [垃圾回收：垃圾数据如何自动回收](./guide/part03/lesson13)
- [编译器和解析器：V8如何执行一段JavaScript代码的](./guide/part03/lesson14)

### 浏览器中的页面循环系统
- [消息队列和事件循环：页面是怎么活起来的](./guide/part04/lesson15)
- [Webapi：setTimeout是怎么实现的](./guide/part04/lesson16)
- [Webapi：XMLHttpRequest是怎么实现的](./guide/part04/lesson17)
- [使用Promise告别回调函数](./guide/part04/lesson19)
- [async await使用同步方式写异步代码](./guide/part04/lesson20)

### 浏览器中的页面
- [页面性能分析：利用chrome做web性能分析](./guide/part05/lesson21)
- [DOM树：JavaScript是如何影响DOM树构建的](./guide/part05/lesson22)
- [渲染流水线：CSS如何影响首次加载时的白屏时间？](./guide/part05/lesson23)
- [分层和合成机制：为什么css动画比JavaScript高效](./guide/part05/lesson24)
- [页面性能：如何系统优化页面](./guide/part05/lesson25)
- [虚拟DOM：虚拟DOM和实际DOM有何不同](./guide/part05/lesson26)
- [PWA：解决了web应用哪些问题](./guide/part05/lesson27)
- [webComponent：像搭积木一样构建web应用](./guide/part05/lesson28)

### 浏览器中的网络
- [HTTP1：HTTP性能优化](./guide/part06/lesson29)
- [HTTP2：如何提升网络速度](./guide/part06/lesson30)
- [HTTP3：甩掉TCP、TCL包袱 构建高效网络](./guide/part06/lesson31)
- [同源策略：为什么XMLHttpRequst不能跨域请求资源](./guide/part06/lesson32)
- [跨站脚本攻击XSS：为什么cookie中有httpOnly属性](./guide/part06/lesson33)
- [CSRF攻击：陌生链接不要随便点](./guide/part06/lesson34)
- [沙盒：页面和系统之间的隔离墙](./guide/part06/lesson35)
- [HTTPS：让数据传输更安全](./guide/part06/lesson36)
