import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { adminDb } from '../firebase-admin';
import { GoogleGenAI } from '@google/genai';

const router = Router({ mergeParams: true });
const ai = new GoogleGenAI({});

router.post('/', requireAuth, async (req: any, res) => {
  try {
        const userId = req.user!.uid;
    const projectId = req.params.projectId;
    const payload = (req.body && typeof req.body === 'object') ? req.body : {};
    const { message } = payload;
    
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const projectData = payload.projectData;
    const historyArray = payload.history || [];
    if (!projectData) {
      res.status(400).json({ error: 'Project data is required' });
      return;
    }
    
    let historyText = historyArray.map((h: any) => `${h.role === 'user' ? 'Student' : 'Mentor'}: ${h.content}`).join('\n');

    

    const prompt = `You are an expert AI mentor for a final-year software engineering student.
    
    Project Title: ${projectData.title}
    Blueprint: ${projectData.blueprint ? JSON.stringify(projectData.blueprint.mvpScopeDescription) : 'Not generated yet'}
    Tech Stack: ${projectData.blueprint ? JSON.stringify(projectData.blueprint.technologyStack?.map((t: any) => t.name)) : projectData.selectedTechnologies}
    
    Student's question: "${message}"
    
    Recent Chat History:
    ${historyText}
    
    Answer the student's question concisely and accurately based on their project context. Provide code examples or architecture advice if relevant. Do NOT act like a generic chatbot. Be a strict, helpful technical mentor.`;

    let responseText = null;
    const models = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    
    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.7,
          }
        });
        responseText = response.text;
        break; 
      } catch (e: any) {
        console.warn(`Mentor Model ${model} failed:`, e.message);
      }
    }

    if (!responseText) throw new Error("AI Generation failed");

        res.json({ response: responseText });

  } catch (error: any) {
    console.error('Error in mentor route:', error);
    res.status(500).json({ error: 'Mentor failed to respond' });
  }
});

export default router;
