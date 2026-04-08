# Webpack 原理

Webpack 是现代化的静态模块打包工具，深入理解其原理有助于优化构建配置。

## 核心概念

```
Entry ──► Module Graph ──► Chunks ──► Assets
  │           │              │          │
  ▼           ▼              ▼          ▼
入口文件    依赖解析       代码分块    输出文件
```

### Entry

```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  }
};
```

### Output

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    publicPath: '/'
  }
};
```

### Loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  }
};
```

### Plugin

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL)
    })
  ]
};
```

## 构建流程

```
1. 初始化参数
      │
      ▼
2. 开始编译（compiler.run）
      │
      ▼
3. 确定入口（entry）
      │
      ▼
4. 编译模块（loader 转换）
      │
      ▼
5. 完成模块编译（AST 分析依赖）
      │
      ▼
6. 输出资源（生成 chunks）
      │
      ▼
7. 输出完成（写入文件系统）
```

## 优化策略

### 代码分割

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

### Tree Shaking

```javascript
// 启用 ES Module 以支持 Tree Shaking
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false  // 在 package.json 中配置
  }
};
```

### 持久化缓存

```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
};
```

::: tip 配置建议
- 开发环境关注构建速度
- 生产环境关注包体积和运行性能
- 合理使用缓存减少重复构建时间
:::
