import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight, Brain, Zap, Target } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://i.ibb.co/7dGTh3P7/Chat-GPT-Image-Sep-5-2026-11-45-34-AM.png" alt="AYROJECT AI logo" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">AYROJECT AI</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 font-medium">Log in</Link>
            <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors">Sign up</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-6xl mb-6">
            From Student Skills to a <br />
            <span className="text-indigo-600">Practical Final-Year Project</span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 dark:text-slate-500 max-w-2xl mx-auto mb-10">
            Stop guessing what project to build. Let AI analyze your skills, recommend realistic project ideas, and generate a complete technical blueprint and roadmap.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <Brain className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Personalized Ideas</h3>
              <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500">Get AI-generated project concepts tailored exactly to your current skills, domain interests, and required complexity.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <Zap className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Technical Blueprints</h3>
              <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500">Receive a complete architectural plan including recommended tech stacks, database schemas, and MVP feature sets.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <Target className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Actionable Roadmaps</h3>
              <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500">Follow a structured week-by-week development roadmap that adapts to your available time and team size.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
