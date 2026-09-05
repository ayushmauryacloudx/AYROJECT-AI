import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} AYROJECT AI. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
          <a href="#" className="hover:text-slate-900 dark:hover:text-white dark:text-white dark:hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white dark:text-white dark:hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white dark:text-white dark:hover:text-white transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}
