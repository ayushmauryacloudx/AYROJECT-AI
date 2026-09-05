import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Roadmap() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!auth.currentUser || !id) return;
      try {
        const { db } = await import('../lib/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(db, 'users', auth.currentUser.uid, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProject({ id: docSnap.id, ...docSnap.data() });
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, auth.currentUser]);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600"/></div>;
  if (!project?.blueprint) return <div className="p-8">Generate blueprint first.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <Link to={`/projects/${id}`} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white dark:text-white mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Project
      </Link>
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Development Roadmap</h1>
        <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 text-lg">Your structured week-by-week plan to build <strong className="text-slate-900 dark:text-white">{project.title}</strong>.</p>
      </div>

      <div className="space-y-8">
        {project.blueprint.developmentRoadmap.map((milestone: any, idx: number) => (
          <div key={idx} className="relative pl-8 md:pl-0">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-8 top-8 bottom-[-2rem] w-px bg-slate-200"></div>
            
            <div className="md:flex gap-8 items-start relative z-10">
              {/* Week Indicator */}
              <div className="hidden md:flex flex-col items-center min-w-[4rem]">
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border-4 border-white shadow-sm flex items-center justify-center font-bold text-indigo-600 text-lg z-10">
                  W{milestone.weekStart}
                </div>
              </div>

              {/* Card */}
              <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-4 md:mb-0">
                <div className="md:hidden inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold mb-3">
                  Week {milestone.weekStart} {milestone.weekStart !== milestone.weekEnd ? `- ${milestone.weekEnd}` : ''}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{milestone.objective}</h3>
                
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Key Tasks</h4>
                  <ul className="space-y-2">
                    {milestone.tasks.map((task: string, i: number) => (
                      <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400 dark:text-slate-500 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-6">
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase">Deliverables</span>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                      {milestone.deliverables.length} items
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase">Est. Effort</span>
                    <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                      ~{milestone.estimatedEffortHours} hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
