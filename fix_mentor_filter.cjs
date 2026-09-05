const fs = require('fs');

let mentorTsx = fs.readFileSync('src/pages/Mentor.tsx', 'utf-8');

mentorTsx = mentorTsx.replace(
  /setMessages\(messagesSnap\.docs\.map\(d => d\.data\(\) as \{ role: 'user' \| 'ai'; content: string \}\)\);/m,
  `setMessages(messagesSnap.docs.map(d => d.data() as { role: 'user' | 'ai'; content: string }).filter(m => m && m.role && m.content));`
);

fs.writeFileSync('src/pages/Mentor.tsx', mentorTsx);
