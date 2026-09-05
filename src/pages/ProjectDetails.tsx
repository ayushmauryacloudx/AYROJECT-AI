import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Box, Code2, ShieldCheck, Play, ArrowRight, Zap, Target } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchProject();
    }
  }, [id, user]);

  const fetchProject = async () => {
    if (!user || !id) return;
    try {
      const { db } = await import('../lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const docRef = doc(db, 'users', user.uid, 'projects', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Project not found');
      }
      
      setProject({ id: docSnap.id, ...docSnap.data() });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateBlueprint = async () => {
    if (!user || !project) return;
    try {
      setGenerating(true);
      const token = await user.getIdToken();
      const res = await fetch(`/api/projects/${id}/blueprint`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectData: project })
      });
      if (!res.ok) throw new Error(await res.text());
      
            const blueprint = await res.json();
      
      const { db } = await import('../lib/firebase');
      const { doc, updateDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'users', user.uid, 'projects', project.id);
      await updateDoc(docRef, {
        blueprint: blueprint,
        status: 'in-progress',
        updatedAt: new Date().toISOString()
      });

      await fetchProject();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">{error || 'Project not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold">
                {project.domain}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:text-slate-200 rounded-full text-sm font-medium uppercase tracking-wider">
                {project.status.replace('-', ' ')}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{project.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 max-w-3xl text-lg">{project.description}</p>
          </div>
          <div className="flex gap-3">
            <Link to={`/projects/${id}/mentor`} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 transition-colors whitespace-nowrap">
              Ask AI Mentor
            </Link>
          </div>
        </div>
      </div>

      {/* Blueprint Section */}
      {!project.blueprint ? (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <Box className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Build Your Project Blueprint</h2>
            <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-8 text-lg">
              Let AI generate a complete technical architecture, feature breakdown, tech stack recommendations, and a weekly development roadmap tailored to your skills.
            </p>
            <button 
              onClick={generateBlueprint}
              disabled={generating}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {generating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating Blueprint...</>
              ) : (
                <><Zap className="w-5 h-5" /> Generate Architecture & Roadmap</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Target & MVP */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-600" /> 
                MVP Scope & Target Users
              </h3>
              <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-4">{project.blueprint.mvpScopeDescription}</p>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 mt-6">Target Users</h4>
              <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500">{project.blueprint.targetUsers}</p>
            </div>

            {/* Architecture */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-indigo-600" /> 
                Architecture Overview
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Frontend:</span>
                  <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mt-1">{project.blueprint.frontendArchitecture}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Backend:</span>
                  <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mt-1">{project.blueprint.backendArchitecture}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Database:</span>
                  <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mt-1">{project.blueprint.databaseDesign}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Core Features</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Feature</th>
                    <th className="px-6 py-4">Purpose</th>
                    <th className="px-6 py-4">Complexity</th>
                    <th className="px-6 py-4">Effort</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {project.blueprint.coreFeatures.map((f: any, i: number) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{f.name}</td>
                      <td className="px-6 py-4">{f.purpose}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium capitalize",
                          f.implementationComplexity === 'high' ? 'bg-red-50 text-red-700' :
                          f.implementationComplexity === 'medium' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        )}>
                          {f.implementationComplexity}
                        </span>
                      </td>
                      <td className="px-6 py-4">{f.estimatedEffortDays} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nav links to roadmap & mentor */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link to={`/projects/${id}/roadmap`} className="group flex items-center justify-between p-6 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors shadow-sm">
              <div>
                <h3 className="text-xl font-bold mb-1">View Development Roadmap</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Step-by-step weekly implementation plan.</p>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors" />
            </Link>
            
            <Link to={`/projects/${id}/mentor`} className="group flex items-center justify-between p-6 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors shadow-sm">
              <div>
                <h3 className="text-xl font-bold mb-1">Talk to AI Mentor</h3>
                <p className="text-indigo-200 text-sm">Get stuck? Ask context-aware questions.</p>
              </div>
              <ArrowRight className="w-6 h-6 text-indigo-200 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
