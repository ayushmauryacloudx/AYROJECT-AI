import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { adminDb } from '../firebase-admin';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const router = Router({ mergeParams: true });
const ai = new GoogleGenAI({});

const featureSchema = {
  type: Type.OBJECT, 
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    purpose: { type: Type.STRING },
    userValue: { type: Type.STRING },
    implementationComplexity: { type: Type.STRING },
    estimatedEffortDays: { type: Type.INTEGER },
    dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
    scope: { type: Type.STRING }
  },
  required: ["id", "name", "purpose", "userValue", "implementationComplexity", "estimatedEffortDays", "dependencies", "scope"]
};

const blueprintSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    problemStatement: { type: Type.STRING },
    targetUsers: { type: Type.STRING },
    proposedSolution: { type: Type.STRING },
    userPersonas: { type: Type.ARRAY, items: { type: Type.STRING } },
    coreFeatures: { type: Type.ARRAY, items: featureSchema },
    advancedFeatures: { type: Type.ARRAY, items: featureSchema },
    mvpScopeDescription: { type: Type.STRING },
    technologyStack: { 
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          whyAppropriate: { type: Type.STRING },
          whereItIsUsed: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          alternativeOption: { type: Type.STRING }
        },
        required: ["name", "role", "whyAppropriate", "whereItIsUsed", "difficulty", "alternativeOption"]
      }
    },
    frontendArchitecture: { type: Type.STRING },
    backendArchitecture: { type: Type.STRING },
    databaseDesign: { type: Type.STRING },
    apiRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
    aiIntegration: { type: Type.STRING },
    authenticationMethod: { type: Type.STRING },
    securityConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } },
    testingStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
    deploymentStrategy: { type: Type.STRING },
    developmentRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          weekStart: { type: Type.INTEGER },
          weekEnd: { type: Type.INTEGER },
          objective: { type: Type.STRING },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
          deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
          dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
          estimatedEffortHours: { type: Type.INTEGER }
        },
        required: ["weekStart", "weekEnd", "objective", "tasks", "deliverables", "dependencies", "estimatedEffortHours"]
      }
    },
    futureImprovements: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: [
    "problemStatement", "targetUsers", "proposedSolution", "userPersonas",
    "coreFeatures", "advancedFeatures", "mvpScopeDescription", "technologyStack",
    "frontendArchitecture", "backendArchitecture", "databaseDesign", "apiRequirements",
    "aiIntegration", "authenticationMethod", "securityConsiderations", "testingStrategy",
    "deploymentStrategy", "developmentRoadmap", "futureImprovements"
  ]
};

router.post('/', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user!.uid;
    const projectId = req.params.projectId;
        const projectData = req.body.projectData;
    if (!projectData) {
      res.status(400).json({ error: 'Missing projectData in request body' });
      return;
    }
    const skills = projectData.studentProfileSnapshot?.skills || [];
    const durationWeeks = projectData.studentProfileSnapshot?.durationWeeks || 12;

    const prompt = `You are a senior technical architect designing a final-year project blueprint.
    
    Project Title: ${projectData.title}
    Domain: ${projectData.domain}
    Description: ${projectData.description}
    Student Skills: ${JSON.stringify(skills)}
    Duration Weeks: ${durationWeeks}
    
    Generate a complete technical blueprint, feature list, and weekly roadmap.
    Ensure the roadmap fits exactly ${durationWeeks} weeks.
    Keep the scope realistic for a student MVP.
    `;

    let responseText = null;
    const models = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    
    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: blueprintSchema,
            temperature: 0.2,
          }
        });
        responseText = response.text;
        break; 
      } catch (e: any) {
        console.warn(`Blueprint Model ${model} failed:`, e.message);
      }
    }

    if (!responseText) throw new Error("AI Generation failed");

    const blueprint = JSON.parse(responseText);
    
        // Return the blueprint to the client, the client SDK will save it.
    // Return the blueprint to the client
    res.json(blueprint);

  } catch (error: any) {
    console.error('Error generating blueprint:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

export default router;
