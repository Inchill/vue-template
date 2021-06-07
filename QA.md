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

然后使用 git cz 命令 代替 git comit 来提交git说明：

```shell
git cz
```

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
