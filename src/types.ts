/**
 * Global TypeScript types for AYROJECT AI
 */

export interface StudentSkill {
  name: string;
  proficiency: number; // 1 to 5
}

export interface StudentProfile {
  branch: string;
  year: number;
  skills: StudentSkill[];
  interests: string[];
  preferredDomains: string[];
  preferredTechnologies: string[];
  teamPreference: 'individual' | 'team';
  teamSize?: number;
  durationWeeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  projectGoals: string[];
  technologiesToLearn: string[];
}

export interface ProjectIdea {
  id: string; // Transient ID before saving
  title: string;
  problem: string;
  solution: string;
  targetUsers: string;
  domain: string;
  whyItMatches: string;
  skillMatchScore: number; // 0-100
  innovationScore: number; // 0-100
  feasibilityScore: number; // 0-100
  estimatedDurationWeeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recommendedTechnologies: string[];
  coreFeatures: string[];
  optionalAdvancedFeatures: string[];
  aiOpportunity: string;
  expectedOutcome: string;
  possibleRisks: string[];
}

export interface SavedProject {
  id: string; // Firestore document ID
  ownerId: string;
  title: string;
  description: string;
  domain: string;
  studentProfileSnapshot: StudentProfile;
  selectedTechnologies: string[];
  status: 'planning' | 'in-progress' | 'completed' | 'abandoned';
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface FeatureRequirement {
  id: string;
  name: string;
  purpose: string;
  userValue: string;
  implementationComplexity: 'low' | 'medium' | 'high';
  estimatedEffortDays: number;
  dependencies: string[];
  scope: 'mvp' | 'should-have' | 'advanced' | 'future';
}

export interface TechnologyRecommendation {
  name: string;
  role: string; // e.g., 'Frontend', 'Backend'
  whyAppropriate: string;
  whereItIsUsed: string;
  difficulty: 'low' | 'medium' | 'high';
  alternativeOption: string;
}

export interface RoadmapMilestone {
  weekStart: number;
  weekEnd: number;
  objective: string;
  tasks: string[];
  deliverables: string[];
  dependencies: string[];
  estimatedEffortHours: number;
}

export interface ProjectBlueprint {
  problemStatement: string;
  targetUsers: string;
  proposedSolution: string;
  userPersonas: string[];
  coreFeatures: FeatureRequirement[];
  advancedFeatures: FeatureRequirement[];
  mvpScopeDescription: string;
  technologyStack: TechnologyRecommendation[];
  frontendArchitecture: string;
  backendArchitecture: string;
  databaseDesign: string;
  apiRequirements: string[];
  aiIntegration: string;
  authenticationMethod: string;
  securityConsiderations: string[];
  testingStrategy: string[];
  deploymentStrategy: string;
  developmentRoadmap: RoadmapMilestone[];
  futureImprovements: string[];
}
