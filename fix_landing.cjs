const fs = require('fs');
let landing = fs.readFileSync('src/pages/Landing.tsx', 'utf-8');

landing = landing.replace(
  /<div className="flex items-center gap-2">\s*<div className="bg-indigo-600 p-1\.5 rounded-lg">\s*<Lightbulb className="w-5 h-5 text-white" \/>\s*<\/div>\s*<span className="text-xl font-bold text-slate-900 dark:text-white">ProjectForge<\/span>\s*<\/div>/,
  `<div className="flex items-center gap-2">
            <img src="https://i.ibb.co/7dGTh3P7/Chat-GPT-Image-Sep-5-2026-11-45-34-AM.png" alt="AYROJECT AI logo" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">AYROJECT AI</span>
          </div>`
);

fs.writeFileSync('src/pages/Landing.tsx', landing);
console.log("Updated Landing.tsx");
