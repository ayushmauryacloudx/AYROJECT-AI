const fs = require('fs');
const path = require('path');

const dirs = ['src/pages', 'src/components', 'src/lib', 'src/contexts'];
dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const pages = [
  'Landing', 'Login', 'Signup', 'Dashboard', 'Generate', 
  'Projects', 'ProjectDetails', 'Mentor', 'Roadmap', 'Settings'
];

pages.forEach(page => {
  const content = `export default function ${page}() {
  return <div className="p-8"><h1 className="text-2xl font-bold">${page}</h1></div>;
}`;
  fs.writeFileSync(path.join(__dirname, 'src', 'pages', `${page}.tsx`), content);
});

fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'utils.ts'), `
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
`);

console.log("Scaffold complete.");
