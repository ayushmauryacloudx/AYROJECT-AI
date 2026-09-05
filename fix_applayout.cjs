const fs = require('fs');

let layout = fs.readFileSync('src/components/AppLayout.tsx', 'utf-8');

layout = `import { useState } from 'react';\n` + layout.replace(`import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';`, `import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';\nimport { Menu, X } from 'lucide-react';`);

layout = layout.replace(/export default function AppLayout\(\) \{/, `export default function AppLayout() {\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);`);

// Sidebar classes update for mobile responsive
layout = layout.replace(
  /<aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">/,
  `<aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>`
);

// Close menu when link clicked
layout = layout.replace(
  /to={item\.path}/g,
  `to={item.path}\n                onClick={() => setIsMobileMenuOpen(false)}`
);

layout = layout.replace(
  /to="\/settings"/g,
  `to="/settings"\n             onClick={() => setIsMobileMenuOpen(false)}`
);

// Add mobile header inside <main> or before <main>
layout = layout.replace(
  /\{(\/\* Main Content \*\/)\}\n\s*<main className="flex-1 overflow-auto flex flex-col">/,
  `{/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col w-full min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 dark:text-slate-300">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <img src="https://i.ibb.co/7dGTh3P7/Chat-GPT-Image-Sep-5-2026-11-45-34-AM.png" alt="Logo" className="w-6 h-6 rounded" />
              AYROJECT
            </span>
          </div>
          <ThemeToggle />
        </div>`
);

fs.writeFileSync('src/components/AppLayout.tsx', layout);
