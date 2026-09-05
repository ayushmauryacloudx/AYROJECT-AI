const fs = require('fs');

const replacement = `<img src="https://i.ibb.co/7dGTh3P7/Chat-GPT-Image-Sep-5-2026-11-45-34-AM.png" alt="ayroject ai logo" className="w-16 h-16 rounded-2xl shadow-sm" />`;

['src/pages/Login.tsx', 'src/pages/Signup.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(
    /<div className="bg-indigo-600 p-3 rounded-xl shadow-sm">\s*<Lightbulb className="w-8 h-8 text-white" \/>\s*<\/div>/,
    replacement
  );
  fs.writeFileSync(file, content);
});
