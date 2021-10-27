## ESLint

```shell
eslint --init
```

不检查 `.html` 文件，在根目录下新增 `.eslintignore` 文件。

## Prettier

Prettier，顾名思义，较美丽的，是一款代码格式化工具，使我们书写的代码格式统一，这样看起来才美观。详细配置可以查看官网。

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "none"
}
```

## EditorConfig

和 prettier 一样，也是用于格式化代码的。这里的配置如下：

```json
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

## husky/lint-staged

在提交 git 之前，我们需要校验我们的代码是否符合规范，如果不符合，则不允许提交代码。

```shell
npm install -D husky

// lint-staged 可以让 husky 只检验 git 工作区的文件，不会导致你一下出现成百上千个错误
npm install -D lint-staged
```

```json
"scripts": {
 "precommit": "eslint src/**/*.js"
}
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "src/**/*.{js,vue}": ["prettier --write", "eslint --cache --fix", "git add"],
  "*": ["git add"]
}
```

在 git commit 之前会进入 工作区文件的扫描，执行 prettier 脚本，修改 eslint 问题，然后重新提交到工作区。

## Commitizen

一个格式化commit message的工具，好处如下：

- 提供更多的历史信息，方便快速浏览

- 可以过滤某些commit，便于筛选代码review

- 可以追踪commit生成更新日志

- 可以关联issues

```shell
npm install -g commitizen
```

安装符合 AngularJS 规范的提交说明，初始化 cz-conventional-changelog 适配器：

```shell
commitizen init cz-conventional-changelog --save --save-exact
```

然后使用 git cz 命令 代替 git commit 来提交git说明：

```shell
git cz
```

之前我们的 git 提交步骤是 git add -> git commit -m "msg" -> git push，现在除了 git add 和 git push 这两步，可以把 git commit 变得更加规范了。

### Commitizen校验

```shell
npm install --save-dev @commitlint/cli

// 安装符合 Angular 风格的校验规则
npm install --save-dev @commitlint/config-conventional
```

在根目录下创建 commitlint.config.js 并配置检验：

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

直接添加配置：

```json
"commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
```

### 给commit加表情

```shell
npm i -g gitmoji-cli
```

## webpack5

### 热更新

安装 `webpack-dev-server`:

```shell
npm i webpack-dev-server -D
```

添加脚本命令：

```json
"dev": "webpack serve --config ./build/webpack.dev.js"
```

### 编译 vue

在 vue2 中使用的是 vue-template-compiler，在 vue3 中则需要使用 @vue/compiler-sfc，vue-loader 则需要安装 16 及之后版本。

```shell
npm i @vue/compiler-sfc vue-loader -D
```

**配置解析规则**

```js
{
  test: /\.vue$/,
  use: ['vue-loader']
}
```

同时别忘了添加 VueLoaderPlugin 插件：

```js
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin

module.exports = {
  plugins: [
    // ...
    new VueLoaderPlugin()
  ]
}
```

### 使用 ts

目前 webpack 转译 typescript 有 2 种方案：单进程和多进程。

| 方案 | --- | --- | --- |
| ---- | --- | --- | --- |
| 单进程(类型检查和转译) | ts-loader(transpileOnly: false) | awesome-typescript-loader |
| 多进程 | ts-loader(transpileOnly: true + fork-ts-checker-webpack-plugin) | awesome-typescript-loader + 自带 type checking | babel-loader + fork-ts-checker-webpack-plugin |

在 babel7 之前，是需要同时使用 ts-loader 和 babel-loader 的，其编译过程 TS > TS 编译器 > JS > Babel > JS 。可见编译了两次js，效率有些低下。但是 babel7 出来之后有了解析 typescript 的能力，有了这一层面的支持，我们就可以只使用 babel，而不用再加一轮 ts 的编译流程了。

因此最推荐的做法是使用 Babel + fork-ts-checker-webpack-plugin 的方式来进行 ts 编译，使用前需要安装 Babel 相关依赖：

```shell
npm i babel-loader @babel/core @babel/preset-env @babel/preset-typescript @babel/plugin-transform-runtime @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread -D
```

上述是需要以 -D 形式安装的开发依赖，babel-loader 是提供给 webapck 使用的 loader，@babel/core 是 babel 处理核心，@babel/preset-env 是自动转换为目标环境运行代码，@babel/preset-typescript 是解析 ts babel 预设用的，@babel/plugin-transform-runtime 是添加 polyfill，@babel/plugin-proposal-class-properties 支持类的写法，@babel/plugin-proposal-object-rest-spread 支持扩展运算符写法。

然后安装生产依赖：

```shell
npm i @babel/runtime @babel/runtime-corejs3 core-js -S
```

@babel/runtime 的作用是将开发者依赖的全局内置对象等，抽取成单独的模块，并通过模块导入的方式引入，避免了对全局作用域的修改（污染）。举个例子：

```js
var promise = new Promise()
```

@babel/runtime 会将其转换为如下代码：

```js
import _Promise from "babel-runtime/core-js/promise"
var promise = new _Promise()
```

@babel/runtime-corejs3 由 core-js@3、@babel/helpers 和regenerator-runtime 组成，@babel/runtime-corejs3 可以转化对象实例的方法。core-js 是用来给低版本浏览器提供 es6+ 新特性接口的库，分为 core-js@2 和 core-js@3。

配置规则如下：

```js
// rules push
{
  test: /\.(t|j)s$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader'
    }
  ]
}

// plugins push
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

new ForkTsCheckerWebpackPlugin()
```

此外需要配置扩展名解析，否则会提示找不到 .ts 文件。

```js
extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json']
```

但是启动项目报了如下几个错误：

```shell
ERROR in ./src/router/index.ts 1:0-46
Module not found: Error: Can't resolve 'core-js/modules/es.array.iterator.js'

ERROR in ./src/router/index.ts 2:0-48
Module not found: Error: Can't resolve 'core-js/modules/es.object.to-string.js'

ERROR in ./src/router/index.ts 3:0-39
Module not found: Error: Can't resolve 'core-js/modules/es.promise.js'

ERROR in ./src/router/index.ts 4:0-47
Module not found: Error: Can't resolve 'core-js/modules/es.string.iterator.js'

ERROR in ./src/router/index.ts 5:0-57
Module not found: Error: Can't resolve 'core-js/modules/web.dom-collections.iterator.js'
```

在 node_modules 下面未找到 core-js，因此执行安装命令：

```shell
npm i core-js -D
```

再次启动项目就可以成功运行了。

### vue3 template 支持多个根元素

对 eslint-plugin-vue 设置 `'vue/valid-template-root': false` 没啥作用，关闭 settings 里的 vetur template 检查也是一样的，最后还是采用一个根元素的方式。

### webpack 配置图片资源处理规则

安装插件file-loader和url-loader，url-loader基于file-loader，所以两个都要安装。 (也可以只使用file-loader，url-loader在file-loader的基础上扩展了功能，比如能设置大于多少KB的图片进行base64转码等）

```shell
npm i file-loader url-loader -D
```

```js
// rules push
{
  test: /\.(png|jpg|gif)$/i,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 10240 // Convert to base64 format when the image size exceeds 10kb.
      }
    }
  ]
}
```

### 启动项目后控制台出现警告⚠️

```shell
runtime-core.esm-bundler.js:3483 You are running the esm-bundler build of Vue. It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals to get proper tree-shaking in the final bundle. See http://link.vuejs.org/feature-flags for more details.
```

从 3.0.0-rc.3 开始，esm-bundler 构建会对外暴露在编译时被覆盖的全局特性标志：__VUE_OPTIONS_API__ 和 __VUE_PROD_DEVTOOLS__。前者表示是否启用/禁用 vue2 中的选项 API 支持，默认为 true，后者表示是否在生产中启用/禁用 devtools 支持，默认为 false。

虽然在不配置这些标志的情况下也能进行构建，但是还是强烈推荐正确配置这些全局标志，这样有利于在最后打包时得到经过 tree-shaking 后的产物。比如我们在源码里采用的书写方式全是 vue3 模式，但是仍然开启了 vue 2 的选项 API 模式，那么对 options API 进行编译处理的框架源码将不会被 tree-shaking 掉。如果你想要完全拥抱 vue3，那么还是推荐关闭 options API 选项。

在配置文件里新增 plugins:

```js
// plugins push
new webpack.DefinePlugin({
  __VUE_OPTIONS_API__: false,
  __VUE_PROD_DEVTOOLS__: false,
})
```

## 使用 vuex

首先安装 vuex4.0 版本：

```shell
npm i vuex@4 -S
```

然后在 store 文件夹下新建 index.ts、state.ts、getters.ts、actions.ts、mutations.ts、mutation-types.ts 文件。

## 配置 axios

axios 是基于 promise 的 http 库，可运行在浏览器端和 node.js 中。他有很多优秀的特性，例如拦截请求和响应、取消请求、转换json、客户端防御XSRF等。所以我们的尤大大也是果断放弃了对其官方库 vue-resource 的维护，直接推荐我们使用 axios 库。

分为了两部分：一是 axios 封装部分，二是业务 API 部分。封装部分通过一个单独的 http.ts 文件进行代码编写。业务 API 放在一个文件夹里管理，里面包含域名管理文件 base-url.ts、api 统一出口文件 index,ts，当项目需要区分不同模块时，可以将某一组关联的 API 单独放在一个文件里。

在封装 axios 的时候，遇到了这样一些 ts 问题。

1. 第三方组件库没有 ts 声明文件

对于 401、403、404 状态，需要给用户进行提示，这时候用到了 at-ui 的 message 组件，使用的时候是按需引入的。

```js
import { Message } from 'at-ui'
```

由于 at-ui 没有提供 ts 声明文件，所以就需要自己去给它编写声明文件。首先在 types 目录下新建 at-ui.d.ts 文件，内容如下：

```ts
declare module 'at-ui' {
  const Message: any
}
```

源码里面暴露出的 Message 是一个函数：

```js
const Message = options => {
  // ... 省略代码

  const instance = new MessageConstructor({
    data: options
  })

  // ... 省略代码

  // 返回关闭方法，用于手动消除
  return function () {
    instance.vm.close(id)
  }
}
```

所以声明文件里的 Message 类型还可以声明为 Function。

2. 使用 localStorage 报错

使用 localStorage 获取某个对象时，会提示如下 ts 错误，原因在于 JSON.parse() 函数接收的参数是 string 类型，而 getItem() 获取到的值可能为 null。

```js
let token = JSON.parse(localStorage.getItem('token'))
```

```shell
Argument of type 'string | null' is not assignable to parameter of type 'string'.
  Type 'null' is not assignable to type 'string'.ts(2345)
```

解决方式是对 parse 参数进行处理，一种是单独定义一个变量并声明类型：

```js
const value: string | any = localStorage.getItem('token')
const token = JSON.parse(value)
```

另一种方式是使用 !，意思是显示告知 ts 推断类型时，这个变量一定存在。

```js
const value = localStorage.getItem('token')
const token = JSON.parse(value!)
```

3. 使用 axios 提供的 ts 声明

```js
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
```

可以对请求头配置进行更改，也可以对响应内容进行处理。

4. 配置 webpack 别名

webpack 配置如下：

```js
  resolve: {
    alias: {
      '@': resolve('src'),
      'src': resolve('src'),
      'router': resolve('src/router'),
      'store': resolve('src/store'),
      'pages': resolve('src/pages'),
      'components': resolve('src/components'),
      'common': resolve('src/common'),
      'public': resolve('public'),
      'dist': resolve('dist'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
    extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json']
  }
```

在引入其它文件的时候，按照如下方式引用，没有任何提示：

```js
import { ACCESS_TOKEN } from '@/common/ts/constants'
```

而且还报了如下错误：

```shell
Cannot find module '@/common/ts/constants' or its corresponding type declarations.
```

这是因为 ts 提示的错误，因此还需要在 tsconfig.json 里添加如下配置：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

必须要指定 baseUrl，这样才能从根目录开始查找。

5. 使用 router 重定向

根据响应状态码来进行页面重定向：

```js
case 401:
  router.replace({
    path: '/login'
  })
  break
case 404:
  Message({
    message: '网络请求不存在',
    type: 'warning',
    duration: 1000
  })
  router.replace({
    path: '/not-found'
  })
  break
```

## 配置 mockjs

使用 mockjs，需要根据环境配置何时开启。具体的步骤如下：

1. 配置环境变量 MOCK，通过配置 npm scripts 命令进行传递；

2. webpack 打包时获取到 MOCK 变量，根据值来加载 mock 文件，在 webpack 配置文件里完成这些操作。



## 支持 js 开发模式

## 参考文档

[vue中Axios的封装和API接口的管理](https://juejin.cn/post/6844903652881072141)
