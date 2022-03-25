# Prompt 22 - Make something that will look completely different in a year.

## Setup

To use this with your own contributions you'll need to generate a personal access token via GitHub. https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line

For scopes you only have to tick `read:user`.

Next, create a new file `/src/config.js`

```
export const config = {
  GITHUB_ACCESS_TOKEN: `<your personal access token>`,
  GITHUB_USERNAME: `<your github username>`,
};
```

Run `yarn && yarn dev`

## Tech

- [react-three-fiber](https://github.com/pmndrs/react-three-fiber)
- [Github API V4](https://docs.github.com/en/graphql/reference/objects#contributionscollection)
