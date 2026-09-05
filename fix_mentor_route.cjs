const fs = require('fs');

let mentorTs = fs.readFileSync('server/routes/mentor.ts', 'utf-8');

mentorTs = mentorTs.replace(
  /\/\/ Fix: Fetch real project and history from DB instead of trusting client[\s\S]*?let historyText = historyArray\.map[^\n]+\n/m,
  `const projectData = payload.projectData;
    const historyArray = payload.history || [];
    if (!projectData) {
      res.status(400).json({ error: 'Project data is required' });
      return;
    }
    
    let historyText = historyArray.map((h: any) => \`\${h.role === 'user' ? 'Student' : 'Mentor'}: \${h.content}\`).join('\\n');
`
);

mentorTs = mentorTs.replace(
  /\/\/ Save the user's message to the database immediately[\s\S]*?createdAt: new Date\(\)\.toISOString\(\)\n    \}\);\n/m,
  ``
);

mentorTs = mentorTs.replace(
  /\/\/ Save AI response directly to database[\s\S]*?res\.json\(\{ response: responseText, message: aiMsg \}\);/m,
  `res.json({ response: responseText });`
);

fs.writeFileSync('server/routes/mentor.ts', mentorTs);
