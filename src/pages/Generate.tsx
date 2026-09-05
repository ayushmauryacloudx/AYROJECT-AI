import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, ArrowRight, Loader2, CheckCircle2, ChevronRight, BarChart } from 'lucide-react';
import { StudentProfile, ProjectIdea } from '../types';
import { auth } from '../lib/firebase';

// Helper array to show progressive loading states
const LOADING_STEPS = [
  "Analyzing your skills...",
  "Matching project domains...",
  "Generating project concepts...",
  "Evaluating feasibility...",
  "Preparing recommendations..."
];

export default function Generate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'form' | 'loading' | 'results' | 'compare'>('form');
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState('');
  
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [profile, setProfile] = useState<Partial<StudentProfile>>({
    branch: '',
    year: 4,
    skills: [{ name: '', proficiency: 3 }],
    interests: [''],
    preferredDomains: [],
    preferredTechnologies: [],
    teamPreference: 'individual',
    teamSize: 1,
    durationWeeks: 12,
    difficulty: 'intermediate',
    projectGoals: [''],
    technologiesToLearn: ['']
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('loading');
    
    // Simulate progressive loading text
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < LOADING_STEPS.length) {
        setLoadingStepIndex(index);
      }
    }, 2000);

    try {
      const token = await user?.getIdToken();
      
      const response = await fetch('/api/ideas/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate ideas');
      }

      const data = await response.json();
      setIdeas(data.ideas);
      setStep('results');
    } catch (err: any) {
      setError(err.message);
      setStep('form');
    } finally {
      clearInterval(interval);
      setLoadingStepIndex(0);
    }
  };

  const saveProject = async (idea: ProjectIdea) => {
    try {
      if (!user) return;
      
      const payload = {
        title: idea.title,
        description: idea.problem + ' ' + idea.solution,
        domain: idea.domain,
        studentProfileSnapshot: profile,
        selectedTechnologies: idea.recommendedTechnologies,
        ownerId: user.uid,
        status: 'planning',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const cleanProject = JSON.parse(JSON.stringify(payload));
      
      const { db } = await import('../lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      
      const docRef = await addDoc(collection(db, 'users', user.uid, 'projects'), cleanProject);
      navigate(`/projects/${docRef.id}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Project Ideation</h1>
        <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mt-2">Let AI design the perfect final-year project based on your unique skills and goals.</p>
      </div>

      {step === 'form' && (
        <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100" role="alert">
              {error}
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Academic Branch</label>
              <input 
                type="text" 
                required 
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="e.g. Computer Science"
                value={profile.branch}
                onChange={e => setProfile({...profile, branch: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Duration (Weeks)</label>
              <input 
                type="number" 
                required 
                min="2" max="52"
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" 
                value={profile.durationWeeks}
                onChange={e => setProfile({...profile, durationWeeks: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Top Skill & Proficiency (1-5)</label>
            <div className="flex gap-4">
              <input 
                type="text" 
                required 
                className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="e.g. React"
                value={profile.skills?.[0]?.name}
                onChange={e => {
                  const newSkills = [...(profile.skills || [])];
                  if (!newSkills[0]) newSkills[0] = { name: '', proficiency: 3 };
                  newSkills[0].name = e.target.value;
                  setProfile({...profile, skills: newSkills});
                }}
              />
              <input 
                type="number" 
                required 
                min="1" max="5"
                className="w-24 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" 
                value={profile.skills?.[0]?.proficiency}
                onChange={e => {
                  const newSkills = [...(profile.skills || [])];
                  if (!newSkills[0]) newSkills[0] = { name: '', proficiency: 3 };
                  newSkills[0].proficiency = parseInt(e.target.value);
                  setProfile({...profile, skills: newSkills});
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Interests / Domains</label>
            <input 
              type="text" 
              required 
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" 
              placeholder="e.g. AI, Healthcare, EdTech (comma separated)"
              value={profile.interests?.join(', ')}
              onChange={e => setProfile({...profile, interests: e.target.value.split(',').map(s => s.trim())})}
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Generate Ideas <Brain className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}

      {step === 'loading' && (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
          <h2 className="text-xl font-medium text-slate-900 dark:text-white" aria-live="polite">
            {LOADING_STEPS[loadingStepIndex]}
          </h2>
          <div className="w-64 bg-slate-100 h-2 rounded-full mt-8 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Generated {ideas.length} tailored ideas</h2>
            <button 
              onClick={() => setStep('compare')}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg transition-colors"
            >
              <BarChart className="w-4 h-4" /> Compare Options
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {ideas.map((idea, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold mb-3">
                    {idea.domain}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{idea.title}</h3>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-6 flex-1 line-clamp-3">
                  <span className="font-medium text-slate-900 dark:text-white">Problem:</span> {idea.problem}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Match</div>
                    <div className="text-lg font-bold text-emerald-600">{idea.skillMatchScore}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Innovation</div>
                    <div className="text-lg font-bold text-blue-600">{idea.innovationScore}/100</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Feasibility</div>
                    <div className="text-lg font-bold text-indigo-600">{idea.feasibilityScore}/100</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => saveProject(idea)}
                  className="w-full flex justify-center items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  Select Project <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'compare' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Compare Ideas</h2>
            <button 
              onClick={() => setStep('results')}
              className="text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white dark:text-white text-sm font-medium"
            >
              Back to Cards
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Project Title</th>
                  <th className="px-6 py-4">Skill Match</th>
                  <th className="px-6 py-4">Innovation</th>
                  <th className="px-6 py-4">Feasibility</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {ideas.map((idea, idx) => {
                  // Deterministic recommendation heuristic (highest combined score)
                  const totalScore = idea.skillMatchScore + idea.innovationScore + idea.feasibilityScore;
                  const isTopPick = totalScore === Math.max(...ideas.map(i => i.skillMatchScore + i.innovationScore + i.feasibilityScore));

                  return (
                    <tr key={idx} className={isTopPick ? 'bg-indigo-50 dark:bg-indigo-900/30/50' : ''}>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {idea.title}
                        {isTopPick && <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300"><CheckCircle2 className="w-3 h-3"/> Top Pick</span>}
                      </td>
                      <td className="px-6 py-4 text-emerald-600 font-medium">{idea.skillMatchScore}%</td>
                      <td className="px-6 py-4">{idea.innovationScore}/100</td>
                      <td className="px-6 py-4">{idea.feasibilityScore}/100</td>
                      <td className="px-6 py-4">{idea.estimatedDurationWeeks} wks</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => saveProject(idea)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
