import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  proficiency: z.number().min(1).max(5),
});

export const profileSchema = z.object({
  branch: z.string().min(2, 'Branch is required'),
  year: z.number().min(1).max(5),
  skills: z.array(skillSchema).min(1, 'Add at least one skill'),
  interests: z.array(z.string()).min(1, 'Add at least one interest'),
  preferredDomains: z.array(z.string()),
  preferredTechnologies: z.array(z.string()),
  teamPreference: z.enum(['individual', 'team']),
  teamSize: z.number().optional(),
  durationWeeks: z.number().min(2).max(52),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  projectGoals: z.array(z.string()),
  technologiesToLearn: z.array(z.string()),
});
