import * as fs from 'fs'
import { promisify } from 'util'
import execa from 'execa'
import ghGot from 'gh-got'
import readPkg from 'read-pkg'

type UrlVersion = {
  url: string
  version: string
}

type ChangesUrlVersion = UrlVersion & {
  changes: string[]
}

const readFile = promisify(fs.readFile)

const getUrlAndVersion = async (): Promise<UrlVersion> => {
  const { repository, version } = await readPkg()
  const url = repository.url
    .replace(/(^git\+|\.git$)/g, '')
    .split('/')
    .slice(-2)
    .join('/')

  return { url, version }
}

const getChanges = async () =>
  (await readFile('changelog.md')).toString().split('\n')

const getIndex = (changes: string[], startIndex: number) =>
  changes.findIndex(
    (value, index) => value.startsWith('### ') && index > startIndex
  )

const createGithubRelease = async ({
  changes,
  url,
  version,
}: ChangesUrlVersion) =>
  await ghGot(`repos/${url}/releases`, {
    body: {
      body: changes.join('\n'),
      tag_name: `v${version}`,
    },
  })

// Run it
export default async () => {
  // Push existing tags so the tag is there to create the release on
  await execa('git', ['push', '--follow-tags'])

  const { url, version } = await getUrlAndVersion()
  const rawChanges = await getChanges()
  const startIndex = getIndex(rawChanges, 0) + 1
  const endIndex = getIndex(rawChanges, startIndex)
  const changes = rawChanges
    .slice(startIndex, endIndex)
    .filter((value) => value !== '')

  await createGithubRelease({ changes, url, version })
}
