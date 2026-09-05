const fs = require('fs');

let dashboard = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

dashboard = dashboard.replace(
  /<div className="mb-8">\s*<h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back<\/h1>\s*<p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mt-2">Pick up where you left off with your project planning\.<\/p>\s*<\/div>/,
  `<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500 mt-2">Pick up where you left off with your project planning.</p>
        </div>
        <Link to="/generate" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm">
          <Lightbulb className="w-5 h-5" />
          Generate New Idea
        </Link>
      </div>`
);

fs.writeFileSync('src/pages/Dashboard.tsx', dashboard);
