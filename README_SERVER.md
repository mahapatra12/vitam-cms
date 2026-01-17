# Server (Backend) - Command Log & Troubleshooting

This document tracks the terminal commands used for the Node.js backend (`/server` directory) and solutions to common errors.

## 🛠️ Initialization & Setup Commands

```powershell
# 1. Initialize Node.js Project
# Creates package.json
npm init -y

# 2. Install Core Dependencies
# express: Web framework
# mongoose: Database ORM
# cors: Cross-Origin Resource Sharing
# dotenv: Environment variables
# jsonwebtoken: Auth tokens
# bcryptjs: Password hashing
# speakeasy: 2FA (TOTP) logic
# qrcode: QR code generation for 2FA
npm install express mongoose cors dotenv jsonwebtoken bcryptjs speakeasy qrcode

# 3. Install Development Dependencies
# nodemon: Auto-restarts server on file changes
npm install -D nodemon
```

## 🚀 Operational Commands

```powershell
# Seed the Database
# Creates Super Admin & Sample Users. PRINTS SECRETS TO CONSOLE.
node seed.js

# Start the Server
# Runs on http://localhost:5000
npm start
```

## ⚠️ Errors & Resolutions

### Error: `MongoNetworkError: failed to connect to server`
**Context**: Running `node seed.js` or `npm start`.
**Cause**: MongoDB service is not running on your machine.
**Resolution Command**:
Open a **new** terminal window and run:
```powershell
mongod
```
*If 'mongod' is not recognized, you need to install MongoDB Community Server.*

### Error: `EADDRINUSE: address already in use :::5000`
**Context**: Running `npm start`.
**Cause**: The server is already running in another terminal.
**Resolution Command**:
```powershell
# Kill all Node.js processes (Windows)
taskkill /F /IM node.exe

# Then restart
npm start
```

### Error: `Error: Cannot find module 'express'`
**Context**: Starting the server.
**Cause**: Dependencies are not installed in the `server` folder.
**Resolution Command**:
```powershell
# Ensure you are in the server directory
cd server
npm install
```

### Error: `ReferenceError: process is not defined` (in seed.js)
**Context**: Running the seed script.
**Cause**: You might be trying to run it with a browser-based runner or incorrect node version (rare).
**Resolution**:
Ensure you are running it with Node:
```powershell
node seed.js
```
