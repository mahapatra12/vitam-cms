# Client (Frontend) - Command Log & Troubleshooting

This document tracks the terminal commands used for the React frontend (`/client` directory) and solutions to common errors.

## 🛠️ Initialization & Setup Commands

```powershell
# 1. Create the Vite React Project
# The '-y' flag skips interactive prompts
npx -y create-vite@latest client --template react

# 2. Navigate into the directory
cd client

# 3. Install Standard Dependencies (from package.json)
npm install

# 4. Install Additional Required Libraries
# axios: For API requests
# react-router-dom: For navigation
# lucide-react: For icons
# framer-motion: For animations
npm install axios react-router-dom lucide-react framer-motion
```

## 🚀 Operational Commands

```powershell
# Start the Development Server
# Runs on http://localhost:5173 by default
npm run dev

# Build for Production
# Creates a 'dist' folder with optimized assets
npm run build
```

## ⚠️ Errors & Resolutions

### Error: `'vite' is not recognized as an internal or external command`
**Context**: Running `npm run dev` immediately after cloning or creating the folder.
**Cause**: `node_modules` are missing.
**Resolution Command**:
```powershell
npm install
```

### Error: `Module not found: Can't resolve 'lucide-react'` (or other package)
**Context**: Browser shows a blank screen or error overlay.
**Cause**: A specific package was not installed.
**Resolution Command**:
```powershell
npm install lucide-react
# OR simply
npm install
```

### Error: `Port 5173 is already in use`
**Context**: Running `npm run dev`.
**Cause**: Another instance of the client is running.
**Resolution**:
Vite usually asks to switch ports automatically. If you want to force close the old one:
```powershell
# Find the process (Windows)
netstat -ano | findstr :5173
# Kill the process (Replace <PID> with the number found above)
taskkill /PID <PID> /F
```
