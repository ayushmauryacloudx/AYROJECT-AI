import { describe, it, expect } from 'vitest';
import { skillSchema, profileSchema } from './schemas';

describe('Schemas Validation', () => {
  it('should validate a correct skill', () => {
    const result = skillSchema.safeParse({ name: 'React', proficiency: 4 });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid skill', () => {
    const result = skillSchema.safeParse({ name: '', proficiency: 6 });
    expect(result.success).toBe(false);
  });

  it('should validate a correct profile', () => {
    const result = profileSchema.safeParse({
      branch: 'Computer Science',
      year: 4,
      skills: [{ name: 'TypeScript', proficiency: 5 }],
      interests: ['AI', 'Web Dev'],
      preferredDomains: ['Web'],
      preferredTechnologies: ['React'],
      teamPreference: 'individual',
      durationWeeks: 12,
      difficulty: 'intermediate',
      projectGoals: ['Learn'],
      technologiesToLearn: ['Node'],
    });
    expect(result.success).toBe(true);
  });
});
