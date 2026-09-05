import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { Loader2, Lightbulb, FolderKanban, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        const { db } = await import('../lib/firebase');
        const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
        const q = query(collection(db, 'users', auth.currentUser.uid, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [auth.currentUser]);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600"/></div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mt-2">Pick up where you left off with your project planning.</p>
        </div>
        <Link to="/generate" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm">
          <Lightbulb className="w-5 h-5" />
          Generate New Idea
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mb-1">Saved Projects</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{projects.length}</h2>
          </div>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <FolderKanban className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Projects</h2>
        <Link to="/projects" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
          <Lightbulb className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Ready to start?</h3>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-6">Let AI generate the perfect project idea based on your skills.</p>
          <Link to="/generate" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Generate Ideas
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} className="block bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold mb-3">
                {p.domain}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 text-sm line-clamp-2">{p.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
