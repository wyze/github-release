const execa = require('execa')
const fs = require('fs')
const ghGot = require('gh-got')
const readPkg = require('read-pkg')

jest.mock('execa')
jest.mock('fs')
jest.mock('gh-got')
jest.mock('read-pkg')

afterEach(jest.resetAllMocks)

it('creates initial github release', async () => {
  execa.mockImplementation((command: 'git', [subCommand]: string[]) =>
    subCommand === 'rev-list'
      ? Promise.resolve({ stdout: '0a1b2c3d4e5f' })
      : undefined
  )

  readPkg.mockResolvedValue({
    name: 'a-fixture',
    version: '1.0.0',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/wyze/a-fixture.git',
    },
  })

  ghGot.mockImplementation()

  fs.readFile
    // Read changelog
    .mockImplementationOnce((_, cb) =>
      cb(
        null,
        '## Change Log\n\n### [v1.0.0](https://github.com/wyze/a-fixture/releases/tag/v1.0.0) (2017-05-05)\n\n* A bug fix PR ([@wyze](https://github.com/wyze) in [#1](https://github.com/wyze/a-fixture/pull/1))\n* Initial Commit ([@wyze](https://github.com/wyze) in [65578dd](https://github.com/wyze/a-fixture/commit/65578dd))\n\n'
      )
    )

  await require('..').default()

  expect(execa).toHaveBeenNthCalledWith(1, 'git', ['push', '--follow-tags'])
  expect(execa).toHaveBeenNthCalledWith(2, 'git', [
    'rev-list',
    '--max-parents=0',
    'HEAD',
  ])
  expect(ghGot).toHaveBeenCalledWith('repos/wyze/a-fixture/releases', {
    body: {
      body:
        '* A bug fix PR ([@wyze](https://github.com/wyze) in [#1](https://github.com/wyze/a-fixture/pull/1))\n* Initial Commit ([@wyze](https://github.com/wyze) in [65578dd](https://github.com/wyze/a-fixture/commit/65578dd))\n\nhttps://github.com/wyze/a-fixture/compare/0a1b2c3...v1.0.0',
      tag_name: 'v1.0.0',
    },
  })
})

it('creates second github release', async () => {
  execa.mockImplementation()

  readPkg.mockResolvedValue({
    name: 'a-fixture',
    version: '2.0.0',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/wyze/a-fixture.git',
    },
  })

  ghGot.mockImplementation()

  fs.readFile
    // Read changelog
    .mockImplementationOnce((_, cb) =>
      cb(
        null,
        '## Change Log\n\n### [v2.0.0](https://github.com/wyze/a-fixture/releases/tag/v2.0.0) (2019-05-05)\n\n* A breaking change ([@wyze](https://github.com/wyze) in [#2](https://github.com/wyze/a-fixture/pull/2))\n\n### [v1.0.0](https://github.com/wyze/a-fixture/releases/tag/v1.0.0) (2017-05-05)\n\n* A bug fix PR ([@wyze](https://github.com/wyze) in [#1](https://github.com/wyze/a-fixture/pull/1))\n* Initial Commit ([@wyze](https://github.com/wyze) in [65578dd](https://github.com/wyze/a-fixture/commit/65578dd))\n\n'
      )
    )

  await require('..').default()

  expect(execa).toHaveBeenCalledWith('git', ['push', '--follow-tags'])
  expect(ghGot).toHaveBeenCalledWith('repos/wyze/a-fixture/releases', {
    body: {
      body:
        '* A breaking change ([@wyze](https://github.com/wyze) in [#2](https://github.com/wyze/a-fixture/pull/2))\n\nhttps://github.com/wyze/a-fixture/compare/v1.0.0...v2.0.0',
      tag_name: 'v2.0.0',
    },
  })
})
