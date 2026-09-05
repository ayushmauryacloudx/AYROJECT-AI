const fs = require('fs');

let generateTsx = fs.readFileSync('src/pages/Generate.tsx', 'utf-8');

generateTsx = generateTsx.replace(
  /<table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">/,
  `<div className="overflow-x-auto">\n            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 whitespace-nowrap">`
);

generateTsx = generateTsx.replace(
  /<\/table>/,
  `</table>\n            </div>`
);

fs.writeFileSync('src/pages/Generate.tsx', generateTsx);
