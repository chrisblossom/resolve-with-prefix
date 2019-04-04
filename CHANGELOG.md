# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [2.0.0] - 2019-04-04

### Changed

-   Add named exports: `resolveWithPrefix`, `resolveWithPrefixSync`, `createResolver`, and `createResolverSync`
-   Breaking: remove default export
-   Breaking: `resolveWithPrefix` / `createResolver` are now async
-   Breaking: remove `new ResolveWithPrefix` syntax

## [1.0.9] - 2019-04-01

### Changed

-   Migrate to Typescript
-   Internal: Use [`@backtrack/preset-node`](https://github.com/chrisblossom/backtrack-preset-node)

## [1.0.8] - 2019-01-02

### Changed

-   Internal: Use [`backtrack`](https://github.com/chrisblossom/backtrack) to manage build environment
-   package updates

## [1.0.4] - 2018-05-09

### Fixed

-   If packageId is equal to prefix, search prefix-packageId first

## [1.0.3] - 2018-04-02

### Changed

-   flow typing updates

## [1.0.2] - 2018-03-23

### Changed

-   refactor tests to remove normalizeRootPath
-   package updates

## [1.0.1] - 2018-03-18

### Fixed

-   add process.env.NODE_PATH to resolve algorithm

### Changed

-   package updates
