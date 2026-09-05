const fs = require('fs');

let mentorTsx = fs.readFileSync('src/pages/Mentor.tsx', 'utf-8');

mentorTsx = mentorTsx.replace(
  /const newMsg = \{ role: 'user' as const, content: userMessage \};\n\s*setMessages\(prev => \[\.\.\.prev, newMsg\]\);\n\s*setSending\(true\);\n\s*try \{\n\s*const \{ db \} = await import\('\.\.\/lib\/firebase'\);\n\s*\/\/ The backend now saves the user message\n\s*const token = await auth\.currentUser\.getIdToken\(\);\n\s*const res = await fetch\(\`\/api\/projects\/\$\{id\}\/mentor\`,\s*\{\n\s*method: 'POST',\n\s*headers: \{ 'Authorization': \`Bearer \$\{token\}\`, 'Content-Type': 'application\/json' \},\n\s*body: JSON\.stringify\(\{ message: userMessage \}\)\n\s*\}\);\n\s*const data = await res\.json\(\);\n\s*const aiMsg = data\.message;\n\s*setMessages\(prev => \[\.\.\.prev, aiMsg\]\);/m,
  `const newMsg = { role: 'user' as const, content: userMessage, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
    setSending(true);

    try {
      const { db } = await import('../lib/firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      
      // Save user message
      const messagesRef = collection(db, 'users', auth.currentUser!.uid, 'projects', id!, 'mentorMessages');
      await addDoc(messagesRef, newMsg);

      const token = await auth.currentUser!.getIdToken();
      const res = await fetch(\`/api/projects/\${id}/mentor\`, {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${token}\`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          projectData: project,
          history: messages.slice(-5)
        })
      });
      
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      const aiMsg = { role: 'ai' as const, content: data.response, createdAt: new Date().toISOString() };
      
      // Save AI message
      await addDoc(messagesRef, aiMsg);
      setMessages(prev => [...prev, aiMsg]);`
);

fs.writeFileSync('src/pages/Mentor.tsx', mentorTsx);
