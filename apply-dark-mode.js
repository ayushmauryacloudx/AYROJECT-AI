import fs from 'fs';
import path from 'path';

const replaceRules = [
    { from: /bg-slate-50(?!\s*dark:bg-slate-950)/g, to: 'bg-slate-50 dark:bg-slate-950' },
    { from: /bg-white(?!\s*dark:bg-slate-900)/g, to: 'bg-white dark:bg-slate-900' },
    { from: /text-slate-900(?!\s*dark:text-white)/g, to: 'text-slate-900 dark:text-white' },
    { from: /text-slate-700(?!\s*dark:text-slate-200)/g, to: 'text-slate-700 dark:text-slate-200' },
    { from: /text-slate-600(?!\s*dark:text-slate-400)/g, to: 'text-slate-600 dark:text-slate-400' },
    { from: /text-slate-500(?!\s*dark:text-slate-400)/g, to: 'text-slate-500 dark:text-slate-400' },
    { from: /text-slate-400(?!\s*dark:text-slate-500)/g, to: 'text-slate-400 dark:text-slate-500' },
    { from: /border-slate-200(?!\s*dark:border-slate-800)/g, to: 'border-slate-200 dark:border-slate-800' },
    { from: /border-slate-100(?!\s*dark:border-slate-800)/g, to: 'border-slate-100 dark:border-slate-800' },
    { from: /border-slate-300(?!\s*dark:border-slate-700)/g, to: 'border-slate-300 dark:border-slate-700' },
    { from: /bg-indigo-50(?!\s*dark:bg-indigo-900\/30)/g, to: 'bg-indigo-50 dark:bg-indigo-900/30' },
    { from: /text-indigo-700(?!\s*dark:text-indigo-300)/g, to: 'text-indigo-700 dark:text-indigo-300' },
    { from: /hover:bg-slate-100(?!\s*dark:hover:bg-slate-800)/g, to: 'hover:bg-slate-100 dark:hover:bg-slate-800' },
    { from: /hover:bg-slate-50(?!\s*dark:hover:bg-slate-800)/g, to: 'hover:bg-slate-50 dark:hover:bg-slate-800' },
    { from: /hover:text-slate-900(?!\s*dark:hover:text-white)/g, to: 'hover:text-slate-900 dark:hover:text-white' },
];

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const rule of replaceRules) {
                if (rule.from.test(content)) {
                    content = content.replace(rule.from, rule.to);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir(path.join(process.cwd(), 'src', 'pages'));
processDir(path.join(process.cwd(), 'src', 'components'));
