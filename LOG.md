## ESLint

```shell
eslint --init
```

不检查 `.html` 文件，在根目录下新增 `.eslintignore` 文件。

## Prettier

## EditorConfig

## husky/lint-staged

在提交 git 之前，我们需要校验我们的代码是否符合规范，如果不符合，则不允许提交代码。

```shell
npm install -D husky

// lint-staged 可以让husky只检验git工作区的文件，不会导致你一下出现成百上千个错误
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

安装符合AngularJS规范的提交说明，初始化cz-conventional-changelog适配器：

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

// 安装符合Angular风格的校验规则
npm install --save-dev @commitlint/config-conventional
```

在根目录下创建 commitlint.config.js 并配置检验：

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
};
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

安装 `webpack-dev-server`:

```shell
npm i webpack-dev-server -D
```

添加脚本命令：

```json
"dev": "webpack serve --config ./build/webpack.dev.js"
```
