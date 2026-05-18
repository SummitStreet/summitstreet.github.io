# summitstreet.github.io

[![CI](https://github.com/SummitStreet/summitstreet.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/SummitStreet/summitstreet.github.io/actions/workflows/ci.yml)

This is [https://summitstreet.tech](https://summitstreet.tech) implemented as a static website. The Svelte-based version of this website is located [here](https://github.com/SummitStreet/summitstreet.tech).

## Prerequisites

- Node.js 24.x

## Dependencies

This project depends on the following first-party packages, published to GitHub Packages:

- [@summitstreet/svelte-ui-sdk](https://github.com/SummitStreet/svelte-ui-sdk) — Svelte component library
- [@summitstreet/web-app-sdk-ts](https://github.com/SummitStreet/web-app-sdk-ts) — Shared TypeScript utilities

## Environment Variables

A `.env` file is required at the project root. Copy `.env.example` and fill in the values:

```sh
cp .env.example .env
```

## Setup

This project installs packages from [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). A GitHub personal access token with `read:packages` scope must be configured before running `npm install`:

```sh
npm login --registry=https://npm.pkg.github.com
```

Then install dependencies:

```sh
npm install
```

## Development

```sh
npm run dev
```

## Building

To create a production version of the site:

```sh
npm run build
```

The output is written to `docs/` for GitHub Pages hosting.
