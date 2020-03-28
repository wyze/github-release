import * as fs from 'fs'
import * as ghGot from 'gh-got'
import { promisify } from 'util'
import execa from 'execa'
import readPkg from 'read-pkg'

type UrlVersion = {
  slug: string
  url: string
  version: string
}

type ChangesUrlVersion = UrlVersion & {
  changes: string[]
  latest: string
}

const readFile = promisify(fs.readFile)

const getUrlAndVersion = async (): Promise<UrlVersion> => {
  const { repository, version } = await readPkg()
  const url = (repository || { url: '' }).url.replace(/(^git\+|\.git$)/g, '')
  const slug = url.split('/').slice(-2).join('/')

  return { slug, url, version }
}

const getChanges = async () =>
  (await readFile('changelog.md')).toString().split('\n')

const getIndex = (changes: string[], startIndex: number) =>
  changes.findIndex(
    (value, index) => value.startsWith('### ') && index > startIndex
  )

const createGithubRelease = async ({
  changes,
  latest,
  slug,
  url,
  version,
}: ChangesUrlVersion) =>
  await ghGot.post({
    body: {
      body: changes.join('\n') + `\n\n${url}/compare/${latest}...v${version}`,
      tag_name: `v${version}`,
    },
    url: `repos/${slug}/releases`,
  })

// Run it
export default async () => {
  // Push existing tags so the tag is there to create the release on
  await execa('git', ['push', '--follow-tags'])

  const rawChanges = await getChanges()
  const startIndex = getIndex(rawChanges, 0) + 1
  const endIndex = getIndex(rawChanges, startIndex)
  const changes = rawChanges
    .slice(startIndex, endIndex)
    .filter((value) => value !== '')
  const latest =
    endIndex > 0
      ? (rawChanges[endIndex].match(/\[([^\]]+)\]/) || ['', ''])[1]
      : (
          await execa('git', ['rev-list', '--max-parents=0', 'HEAD'])
        ).stdout.slice(0, 7)

  await createGithubRelease({ changes, latest, ...(await getUrlAndVersion()) })
}
