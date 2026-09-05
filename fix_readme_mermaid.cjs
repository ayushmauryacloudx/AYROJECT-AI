const fs = require('fs');

let readme = fs.readFileSync('README.md', 'utf-8');

const newArchitecture = `## Application Architecture & Data Flow

\`\`\`mermaid
graph TD
    UI[React Frontend]
    Auth[Firebase Auth]
    FS[(Cloud Firestore)]
    API[Express Backend server.ts]
    Secret[(Google Secret Manager)]
    Gemini{Google Gemini API}
    
    UI -->|Authentication| Auth
    UI -->|Direct Read/Write| FS
    FS -.->|Strict Security Rules| UI
    
    UI -->|API Requests| API
    API -.->|JSON Responses| UI
    
    API -->|Fetch Credentials| Secret
    API -->|AI Prompts & History| Gemini
    Gemini -.->|Summaries & Chat| API
\`\`\`

## Complete Project Guide & Repository Structure

This repository is structured as a full-stack monolith where a Node/Express backend serves both the API and the compiled React frontend.

*   \`server.ts\`: The core Express backend. It handles secure API routes (like \`/api/projects/generate\` and \`/api/projects/:id/mentor\`), securely retrieves the Gemini API key, and mounts Vite as middleware in development.
*   \`src/App.tsx\`: The main React application shell. Manages authentication state and sidebar navigation routing.
*   \`src/pages/Mentor.tsx\`: The primary conversational interface. Handles real-time messaging and Firestore document synchronization.
*   \`src/lib/firebase.ts\`: Client-side Firebase configuration and initialization.`;

readme = readme.replace(/## 🏗️ System Architecture[\s\S]*?(?=---)/, newArchitecture + '\n\n');

fs.writeFileSync('README.md', readme);
