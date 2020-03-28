# @wyze/github-release &middot; [![Build Status][actions-image]][actions-url] [![npm][npm-image]][npm-url] [![Codecov.io][codecov-image]][codecov-url]

> Generate a GitHub release.

## Installation

```sh
$ yarn add --dev @wyze/github-release
```

## Usage

```json
{
  "scripts": {
    "postversion": "github-release"
  }
}
```

or

```sh
$ github-release
```

## Change Log

> [Full Change Log](changelog.md)

### [v1.1.1](https://github.com/wyze/github-release/releases/tag/v1.1.1) (2020-03-28)

* Fix release not being created ([@wyze](https://github.com/wyze) in [37e6cff](https://github.com/wyze/github-release/commit/37e6cff))

## License

MIT © [Neil Kistner](//neilkistner.com)

[actions-image]: https://img.shields.io/github/workflow/status/wyze/github-release/CI.svg?style=flat-square
[actions-url]: https://github.com/wyze/github-release/actions

[npm-image]: https://img.shields.io/npm/v/@wyze/github-release.svg?style=flat-square
[npm-url]: https://npmjs.com/package/@wyze/github-release

[codecov-image]: https://img.shields.io/codecov/c/github/wyze/github-release.svg?style=flat-square
[codecov-url]: https://codecov.io/github/wyze/github-release
