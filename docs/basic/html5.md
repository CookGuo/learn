# HTML5 新特性

HTML5 带来了众多新特性和 API，大大增强了 Web 平台的能力。

## 新增表单类型

```html
<!-- 邮箱验证 -->
<input type="email" placeholder="your@email.com">

<!-- 日期选择 -->
<input type="date" min="2024-01-01" max="2024-12-31">

<!-- 颜色选择器 -->
<input type="color" value="#ff0000">

<!-- 范围滑块 -->
<input type="range" min="0" max="100" value="50">

<!-- 搜索框 -->
<input type="search" results="5" placeholder="搜索...">

<!-- 数字输入 -->
<input type="number" step="0.01" min="0">
```

### 表单验证

```html
<form>
  <!-- 必填字段 -->
  <input type="text" required>
  
  <!-- 模式匹配 -->
  <input type="text" pattern="[A-Za-z]{3}">
  
  <!-- 自定义验证消息 -->
  <input type="email" 
         required 
         oninvalid="this.setCustomValidity('请输入有效邮箱')"
         oninput="this.setCustomValidity('')">
</form>
```

## 多媒体支持

### 视频

```html
<video controls width="640" height="360" poster="preview.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <track kind="subtitles" src="subtitles_zh.vtt" srclang="zh" label="中文">
  您的浏览器不支持视频播放。
</video>
```

### 音频

```html
<audio controls>
  <source src="music.mp3" type="audio/mpeg">
  <source src="music.ogg" type="audio/ogg">
</audio>
```

## Canvas 绘图

```html
<canvas id="myCanvas" width="400" height="200"></canvas>

<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制矩形
ctx.fillStyle = '#FF0000';
ctx.fillRect(10, 10, 100, 50);

// 绘制圆形
ctx.beginPath();
ctx.arc(200, 75, 50, 0, 2 * Math.PI);
ctx.stroke();
</script>
```

## 本地存储

```javascript
// LocalStorage - 持久存储
localStorage.setItem('username', 'John');
const username = localStorage.getItem('username');
localStorage.removeItem('username');

// SessionStorage - 会话级存储
sessionStorage.setItem('temp', 'value');

// IndexedDB - 结构化数据存储
const request = indexedDB.open('MyDatabase', 1);
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('users', { keyPath: 'id' });
  store.createIndex('name', 'name', { unique: false });
};
```

## 新 JavaScript API

### 地理定位

```javascript
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position.coords.latitude, position.coords.longitude);
    },
    (error) => console.error(error)
  );
}
```

### File API

```html
<input type="file" id="fileInput" accept="image/*">
<img id="preview">

<script>
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    document.getElementById('preview').src = event.target.result;
  };
  reader.readAsDataURL(file);
});
</script>
```

### Drag and Drop

```html
<div id="dropZone" style="border: 2px dashed #ccc; padding: 20px;">
  拖放文件到此处
</div>

<script>
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#000';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  console.log('Dropped files:', files);
});
</script>
```

::: tip 浏览器兼容性
使用 [Can I Use](https://caniuse.com/) 查询各特性的浏览器支持情况，对于不支持的特性提供优雅降级。
:::
