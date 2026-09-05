# AYROJECT AI
From Student Skills to a Practical Final-Year Project

## Overview
AYROJECT AI is an advanced, AI-powered platform designed to mentor final-year students from their initial skill assessment all the way to a fully-architected final-year project blueprint. It resolves the common issue of students selecting overly complex or under-scoped projects by grounding ideas in real constraints and providing a clear, actionable roadmap.

## Problem Statement
Final-year students often struggle to generate practical project ideas that align with their current technical skills, career goals, and the limited timeframe of an academic semester. They need guidance on architectural decisions, feature scoping, and development roadmaps.

## Solution
AYROJECT AI bridges this gap by acting as a personalized technical mentor. It takes a student's profile (skills, proficiency, interests, timeframe) and uses server-side Gemini AI reasoning to construct feasible project concepts. Once a concept is selected, it generates a complete blueprint (MVP features, database schema, architecture) and an adaptive weekly roadmap. A context-aware AI mentor is available to answer questions specific to the generated blueprint.

## Key Features
- **Deterministic Idea Generation**: Controlled AI generation mapping student skills to feasible projects.
- **Project Blueprinting**: Architectural, DB, and tech-stack synthesis tailored for student MVPs.
- **Adaptive Roadmapping**: Week-by-week structured planning based on the chosen project duration.
- **Context-Aware AI Mentor**: A focused AI assistant pre-loaded with the specific student and project context.
- **Comparison Engine**: Data-driven metrics for skill matching, feasibility, and innovation.

## User Workflow
1. **Authentication**: Secure entry via Firebase Auth.
2. **Profile Generation**: Input academic details, skills, and duration.
3. **Idea Comparison**: Compare 3-5 distinct project ideas and select the most feasible.
4. **Blueprint Generation**: Expand the selected idea into a detailed tech spec.
5. **Mentorship & Execution**: Follow the roadmap and consult the AI Mentor for technical hurdles.

## Architecture
```mermaid
graph TD
    UI[React Frontend (Vite/Tailwind)] --> Auth[Firebase Authentication]
    UI --> API[Express Backend]
    API --> FS[(Cloud Firestore)]
    API --> Gemini[Google Gemini API]
    API --> RateLimit[Rate Limiter]
```

## AI Architecture
- **Server-Side Only**: All `@google/genai` interactions are handled securely on the backend.
- **Controlled Generation**: Strict prompt templates using JSON schemas enforce deterministic, machine-readable output.
- **Context Injection**: The AI Mentor endpoint dynamically injects the student's profile and previously generated blueprint to maintain strict relevance and avoid generic chatbot behavior.
- **Resilient Fallbacks**: Backend wraps model calls (`gemini-3.6-flash`, `gemini-3.1-flash-lite`) in a fallback chain to ensure high availability.

## Security
- **Data Isolation**: `firestore.rules` enforces strictly owner-bound read/write access.
- **Payload Sanitization**: Zod schemas validate API bounds. Express limits payload size to 1MB.
- **Secret Management**: API keys are securely managed via Google Cloud Secret Manager and never reach the client bundle.
- **Network Defenses**: Helmet.js and CORS middleware protect API routes. Rate limiting prevents API abuse.

## Tech Stack
**Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Lucide React, React Router
**Backend**: Express.js, TypeScript, Node.js
**Database**: Cloud Firestore
**AI**: Google Gemini API (`@google/genai`)
**Auth**: Firebase Authentication

## Environment Setup & Deployment

### Local Setup
1. Create a Firebase project and configure `firebase-applet-config.json`.
2. Add your Gemini API key to `.env`: `GEMINI_API_KEY="..."`
3. Run `npm install` and `npm run dev`.

### Google Cloud Run Deployment
To deploy this application to Google Cloud Run, follow these steps:

1. **Configure Secret Manager**:
```bash
# Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Grant the default Cloud Run service account access to read the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

2. **Deploy to Cloud Run**:
```bash
gcloud run deploy projectforge-ai \
  --source . \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --allow-unauthenticated \
  --region=us-central1
```

3. **Required Campaign Labeling**:
```bash
gcloud run services update projectforge-ai \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=us-central1
```

## Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
