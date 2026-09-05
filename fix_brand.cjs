const fs = require('fs');

let layout = fs.readFileSync('src/components/AppLayout.tsx', 'utf-8');

layout = layout.replace(
  /<div className="bg-indigo-600 p-1\.5 rounded-lg">\s*<Lightbulb className="w-5 h-5 text-white" \/>\s*<\/div>\s*ProjectForge/,
  `<img src="https://i.ibb.co/7dGTh3P7/Chat-GPT-Image-Sep-5-2026-11-45-34-AM.png" alt="ayroject ai logo" className="w-8 h-8 rounded-lg" />
            ayroject ai`
);

fs.writeFileSync('src/components/AppLayout.tsx', layout);
