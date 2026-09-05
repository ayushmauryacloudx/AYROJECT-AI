import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { profileSchema } from '../../src/lib/schemas';

const router = Router();
// Note: Requires GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({});

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      problem: { type: Type.STRING },
      solution: { type: Type.STRING },
      targetUsers: { type: Type.STRING },
      domain: { type: Type.STRING },
      whyItMatches: { type: Type.STRING },
      skillMatchScore: { type: Type.INTEGER },
      innovationScore: { type: Type.INTEGER },
      feasibilityScore: { type: Type.INTEGER },
      estimatedDurationWeeks: { type: Type.INTEGER },
      difficulty: { type: Type.STRING },
      recommendedTechnologies: { type: Type.ARRAY, items: { type: Type.STRING } },
      coreFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
      optionalAdvancedFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
      aiOpportunity: { type: Type.STRING },
      expectedOutcome: { type: Type.STRING },
      possibleRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: [
      "title", "problem", "solution", "targetUsers", "domain", 
      "whyItMatches", "skillMatchScore", "innovationScore", "feasibilityScore",
      "estimatedDurationWeeks", "difficulty", "recommendedTechnologies", 
      "coreFeatures", "optionalAdvancedFeatures", "aiOpportunity", 
      "expectedOutcome", "possibleRisks"
    ]
  }
};

router.post('/generate', requireAuth, async (req, res) => {
  try {
    // Defensive Payload Ingestion
    const payload = (req.body && typeof req.body === 'object') ? req.body : {};
    
    // Validate request body
    const profile = profileSchema.parse(payload);

    const prompt = `You are a senior technical mentor advising a final-year student on their capstone project. 
    Analyze the student's profile and generate 3 to 5 distinct, practical, and highly relevant project ideas.
    
    Student Profile:
    ${JSON.stringify(profile, null, 2)}
    
    Guidelines:
    - The projects must be realistic to build in ${profile.durationWeeks} weeks.
    - Match the difficulty level: ${profile.difficulty}.
    - Ensure technologies align with their current skills and the ones they want to learn.
    - Do not invent unrealistic technologies.
    - Prioritize MVP scope.
    - Respond strictly with JSON.`;

    // Attempt Gemini call with fallback logic for resilience
    let responseText = null;
    const models = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    
    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.7,
          }
        });
        responseText = response.text;
        break; // Success
      } catch (e: any) {
        console.warn(`Model ${model} failed:`, e.message);
        // Continue to next fallback model
      }
    }

    if (!responseText) {
      res.status(503).json({ error: "Service unavailable. All Gemini generation attempts failed." });
      return;
    }

    const parsedIdeas = JSON.parse(responseText);
    res.json({ ideas: parsedIdeas });

  } catch (error: any) {
    console.error('Generate ideas error:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Invalid profile data', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to generate ideas. Please try again.' });
  }
});

export default router;
