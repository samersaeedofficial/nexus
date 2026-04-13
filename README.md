# Nexus Evil Twib Tool

This repository contains a React + Vite portal application and a Node.js backend server for secure network authentication and data capture.

## Structure

- `Source/` - React application source, Vite config, backend server file, and app assets.
- `Source/src/` - React app source code.
- `Source/server.js` - Express backend for `/api` endpoints and static asset serving.
- `Source/network_config.json` - Network settings used by the portal.
- `server.js` - Root copy of the same backend server for production or local hosting.
- `dist/` - Built production output.

## Fixes Applied

- Updated `Source/package.json` to use `date-fns@^3.6.0`, resolving the peer dependency conflict with `react-day-picker`.
- Added a `start` script in `Source/package.json` to run `node server.js`.
- Added a Vite dev proxy for `/api` endpoints so the app can call the backend during local development.
- Updated backend server files to use `process.env.PORT || 3000` for easier local startup.
- Made backend config loading robust by resolving `network_config.json` from the server directory.
- Updated server startup logs to display the actual listening port.

## Prerequisites

- Node.js 18 or later
- npm 10 or later
- A terminal/command prompt

## Clone the repository

From your computer, run:

```bash
git clone <your-repo-url> nexus_evil_twib_tool
cd nexus_evil_twib_tool
```

## Setup and install dependencies

1. Open the terminal in the project root:
   ```bash
   cd /home/samer/nexus_evil_twib_tool
   ```

2. Install the app dependencies from the `Source` folder:
   ```bash
   cd Source
   npm install
   ```

## Run in development mode

Open two terminals and run these commands.

Terminal 1: start the React app:

```bash
cd /home/samer/nexus_evil_twib_tool/Source
npm run dev
```

Terminal 2: start the backend server:

```bash
cd /home/samer/nexus_evil_twib_tool/Source
npm start
```

Then open the browser at:

```bash
http://localhost:5173
```

> The backend server listens on `http://localhost:3000` by default.

## Production build

1. Build the React app:
   ```bash
   cd /home/samer/nexus_evil_twib_tool/Source
   npm run build
   ```

2. Serve the built app with the backend server:
   ```bash
   cd /home/samer/nexus_evil_twib_tool/Source
   npm start
   ```

3. Open the browser at:
   ```bash
   http://localhost:3000
   ```

## GitHub push and ignored files

This repository includes a `.gitignore` file that prevents the following from being pushed to GitHub:

- `node_modules/`
- `Source/node_modules/`
- `dist/`
- `Source/dist/`
- `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`
- `.DS_Store`
- `.env` and other environment files

Only the source code, project config, and documentation will be tracked.

## Notes

- The backend server exposes `/api/network-info`, `/api/save-password`, and `/api/save-registration`.
- The React app fetches `/api/network-info` on load and submits password and registration data to the backend.
- Use `Source/server.js` when running locally from the `Source` folder.
- If you want to use a different backend port, set `PORT` before starting the server, for example:
  ```bash
  PORT=4000 npm start
  ```