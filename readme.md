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

### [v1.1.0](https://github.com/wyze/github-release/releases/tag/v1.1.0) (2020-03-28)

* Add missing @wyze/changelog command ([@wyze](https://github.com/wyze) in [a6a7a29](https://github.com/wyze/github-release/commit/a6a7a29))
* Fix build error ([@wyze](https://github.com/wyze) in [a59f04d](https://github.com/wyze/github-release/commit/a59f04d))
* Update build readme badge ([@wyze](https://github.com/wyze) in [524eb21](https://github.com/wyze/github-release/commit/524eb21))
* Switch to GitHub actions ([@wyze](https://github.com/wyze) in [#7](https://github.com/wyze/github-release/pull/7))
* Add lint and type-check commands ([@wyze](https://github.com/wyze) in [2a0d7d1](https://github.com/wyze/github-release/commit/2a0d7d1))
* Generate compare URL and add to release ([@wyze](https://github.com/wyze) in [ce2b477](https://github.com/wyze/github-release/commit/ce2b477))
* Upgrade dependencies ([@wyze](https://github.com/wyze) in [44537e9](https://github.com/wyze/github-release/commit/44537e9))

## License

MIT © [Neil Kistner](//neilkistner.com)

[actions-image]: https://img.shields.io/github/workflow/status/wyze/github-release/CI.svg?style=flat-square
[actions-url]: https://github.com/wyze/github-release/actions

[npm-image]: https://img.shields.io/npm/v/@wyze/github-release.svg?style=flat-square
[npm-url]: https://npmjs.com/package/@wyze/github-release

[codecov-image]: https://img.shields.io/codecov/c/github/wyze/github-release.svg?style=flat-square
[codecov-url]: https://codecov.io/github/wyze/github-release
