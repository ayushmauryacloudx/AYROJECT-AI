import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { SavedProject } from '../types';
import { FolderKanban, Loader2, ArrowRight } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SavedProject[];
        setProjects(projectsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Projects</h1>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mt-2">Manage your saved project ideas and track their progress.</p>
        </div>
        <Link 
          to="/generate" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Generate New Idea
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">{error}</div>
      )}

      {projects.length === 0 && !error ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
          <FolderKanban className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No projects yet</h2>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-6">Generate your first AI-tailored project idea to get started.</p>
          <Link 
            to="/generate"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Generate Project Idea <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold mb-3">
                  {project.domain}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{project.title}</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-6 flex-1 line-clamp-3">
                {project.description}
              </p>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {project.status.replace('-', ' ')}
                </span>
                <Link 
                  to={`/projects/${project.id}`}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
