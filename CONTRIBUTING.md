# Contributing

## How to release and publish packages ? 

This monorepo uses the `lerna` tool for the management of multipackages. This tool also allows to publish the changelogs and automatically create the github releases associated to the git tag.

To create a release, you just need to have the `GH_TOKEN` de variable defined in your shell and then execute the command:

```
GH_TOKEN=<your-github-token> yarn release
``` 

Once the releases have been created, all you have to do is publish them on NPM.

```
yarn lerna:publish
```
