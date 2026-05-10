# Adventure Board

Small web UI for the Dragons of Mugloar game and a script.

## Run locally

1. Install [Node.js](https://nodejs.org/) (v18 or newer).
2. Install [pnpm](https://pnpm.io/installation).
3. In this folder:

```bash
pnpm install
pnpm dev
```

The dev server proxies `/api` to the real game server, so the app should work without extra config.

## Script

Automated game, trying to get the best score it can

```bash
pnpm bot
```

```bash
API_BASE=https://dragonsofmugloar.com/api/v2 pnpm bot
```
