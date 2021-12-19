# Code style guide

## Install

```console
yarn add -D eslint @babel/eslint-parser
```

```console
npm install --save-dev eslint @babel/eslint-parser
```

## Create config files

<details>
<summary>.eslintignore</summary>

```text
dist
build
node_modules
```

</details>

<details>
<summary>.eslintrc</summary>

```js
{
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2020
  },
  "parser": "@babel/eslint-parser",
  "rules": {
    "indent": [
      "error",
      4
    ],
    "quotes": [
      "error",
      "single",
      {
        "allowTemplateLiterals": true
      }
    ],
    "semi": [
      "error",
      "always"
    ],
    "curly": [
      "error",
      "all"
    ],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "no-else-return": [
      "warn",
      {
        "allowElseIf": false
      }
    ],
    "brace-style": [
      "error",
      "1tbs",
      {
        "allowSingleLine": false
      }
    ],
    "func-call-spacing": [
      "error",
      "never"
    ],
    "multiline-ternary": [
      "error",
      "always"
    ],
    "newline-per-chained-call": [
      "error",
      {
        "ignoreChainWithDepth": 2
      }
    ],
    "no-lonely-if": [
      "error"
    ],
    "arrow-parens": [
      "error",
      "always"
    ],
    "arrow-body-style": [
      "error",
      "as-needed"
    ],
    "arrow-spacing": [
      "error",
      {
        "before": true,
        "after": true
      }
    ],
    "no-useless-concat": "warn",
    "prefer-template": "warn",
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1,
        "maxEOF": 1,
        "maxBOF": 0
      }
    ],
    "eol-last": [
      "error",
      "always"
    ],
    "padded-blocks": [
      "error",
      "never"
    ],
    "no-trailing-spaces": "error",
    "padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": "return"
      }
    ]
  }
}
```

</details>
