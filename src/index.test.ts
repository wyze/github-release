import * as execa from 'execa'
import * as ghGot from 'gh-got'
import * as readPkg from 'read-pkg'
import fs from 'fs'

jest.mock('execa')
jest.mock('fs')
jest.mock('gh-got')
jest.mock('read-pkg')

afterEach(jest.resetAllMocks)

it('creates initial github release', async () => {
  jest.spyOn(execa, 'default').mockImplementation((_command, subCommands) => {
    const output = require.requireActual('execa').sync('node', ['--version'])

    return (subCommands as string[])[0] === 'rev-list'
      ? { ...output, stdout: '0a1b2c3d4e5f' }
      : output
  })

  jest.spyOn(readPkg, 'default').mockResolvedValue({
    name: 'a-fixture',
    version: '1.0.0',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/wyze/a-fixture.git',
    },
  })

  jest.spyOn(ghGot, 'default').mockImplementation()

  // Read changelog
  jest
    .spyOn(fs, 'readFile')
    .mockImplementationOnce((_, cb) =>
      cb(
        null,
        Buffer.from(
          '## Change Log\n\n### [v1.0.0](https://github.com/wyze/a-fixture/releases/tag/v1.0.0) (2017-05-05)\n\n* A bug fix PR ([@wyze](https://github.com/wyze) in [#1](https://github.com/wyze/a-fixture/pull/1))\n* Initial Commit ([@wyze](https://github.com/wyze) in [65578dd](https://github.com/wyze/a-fixture/commit/65578dd))\n\n'
        )
      )
    )

  await require('.').default()

  expect(execa).toHaveBeenNthCalledWith(1, 'git', ['push', '--follow-tags'])
  expect(execa).toHaveBeenNthCalledWith(2, 'git', [
    'rev-list',
    '--max-parents=0',
    'HEAD',
  ])
  expect(ghGot).toHaveBeenCalledWith('repos/wyze/a-fixture/releases', {
    json: {
      body:
        '* A bug fix PR ([@wyze](https://github.com/wyze) in [#1](https://github.com/wyze/a-fixture/pull/1))\n* Initial Commit ([@wyze](https://github.com/wyze) in [65578dd](https://github.com/wyze/a-fixture/commit/65578dd))\n\nhttps://github.com/wyze/a-fixture/compare/0a1b2c3...v1.0.0',
      tag_name: 'v1.0.0',
    },
  })
})

it('creates second github release', async () => {
  jest.spyOn(execa, 'default').mockImplementation()

  jest.spyOn(readPkg, 'default').mockResolvedValue({
    name: 'a-fixture',
    version: '2.0.0',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/wyze/a-fixture.git',
    },
  })

  jest.spyOn(ghGot, 'default').mockImplementation()

  // Read changelog
  jest
    .spyOn(fs, 'readFile')
    .mockImplementationOnce((_, cb) =>
      cb(
        null,
        Buffer.from(
          '## Change Log\n\n### [v2.0.0](https://github.com/wyze/a-fixture/releases/tag/v2.0.0) (2019-05-05)\n\n* A breaking change ([@wyze](https://github.com/wyze) in [#2](https://github.com/wyze/a-fixture/pull/2))\n\n### [v1.0.0](https://github.com/wyze/a-fixture/releases/tag/v1.0.0) (2017-05-05)\n\n* A bug fix PR ([@wyze](https://github.com/wyze) in [#1](https://github.com/wyze/a-fixture/pull/1))\n* Initial Commit ([@wyze](https://github.com/wyze) in [65578dd](https://github.com/wyze/a-fixture/commit/65578dd))\n\n'
        )
      )
    )

  await require('.').default()

  expect(execa).toHaveBeenCalledWith('git', ['push', '--follow-tags'])
  expect(ghGot).toHaveBeenCalledWith('repos/wyze/a-fixture/releases', {
    json: {
      body:
        '* A breaking change ([@wyze](https://github.com/wyze) in [#2](https://github.com/wyze/a-fixture/pull/2))\n\nhttps://github.com/wyze/a-fixture/compare/v1.0.0...v2.0.0',
      tag_name: 'v2.0.0',
    },
  })
})
