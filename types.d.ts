declare module 'gh-got' {
  import { CancelableRequest, GotOptions, Response } from 'got'

  interface GitHubGotOptions extends GotOptions {
    body: GotOptions['json']
  }

  export const post: <T>(
    options: GitHubGotOptions
  ) => CancelableRequest<Response<T>>

  export { default } from 'got'
}
