import { GoogleGenAI, Type, Schema } from '@google/genai';
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

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "test",
      config: {
        responseMimeType: "application/json",
        responseSchema: blueprintSchema,
        temperature: 0.2,
      }
    });
    console.log(response.text);
  } catch(e: any) {
    console.log(e);
  }
}
test();
