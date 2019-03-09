const execa = require('execa')
const fs = require('fs')
const ghGot = require('gh-got')
const readPkg = require('read-pkg')

jest.mock('execa')
jest.mock('fs')
jest.mock('gh-got')
jest.mock('read-pkg')

it('creates github release', async () => {
  execa.mockImplementation()

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

  expect(execa).toHaveBeenCalledWith('git', ['push', '--follow-tags'])
  expect(ghGot).toHaveBeenCalledWith('repos/wyze/a-fixture/releases', {
    body: {
      body:
        '* A bug fix PR ([@wyze](https://github.com/wyze) in [#1](https://github.com/wyze/a-fixture/pull/1))\n* Initial Commit ([@wyze](https://github.com/wyze) in [65578dd](https://github.com/wyze/a-fixture/commit/65578dd))',
      tag_name: 'v1.0.0',
    },
  })
})
