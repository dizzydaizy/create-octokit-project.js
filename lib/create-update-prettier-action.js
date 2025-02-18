module.exports = createUpdatePrettierAction;

const writePrettyFile = require("./write-pretty-file");

async function createUpdatePrettierAction() {
  await writePrettyFile(
    ".github/workflows/update-prettier.yml",
    `name: Update Prettier
on:
  push:
    branches:
      - "dependabot/npm_and_yarn/prettier-*"
  workflow_dispatch: {}
jobs:
  update_prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "lts/*"
      - uses: actions/cache@v1
        with:
          path: ~/.npm
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-node-
      - run: npm ci
      - run: npm run lint:fix
      - uses: gr2m/create-or-update-pull-request-action@v1.x
        env:
          GITHUB_TOKEN: \${{ secrets.OCTOKITBOT_PAT }}
        with:
          title: "Prettier updated"
          body: "An update to prettier required updates to your code."
          branch: \${{ github.ref }}
          commit-message: "style: prettier"
`
  );
}
